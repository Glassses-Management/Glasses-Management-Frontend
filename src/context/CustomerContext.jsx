import { useCallback, useEffect, useState } from "react";
import { CustomerContext } from "@/context/CustomerContextStore";
import { useAuth } from "@/hook/UseAuth";
import { getCustomers, createCustomer as createCustomerApi, updateCustomer as updateCustomerApi, deleteCustomer as deleteCustomerApi } from "@/api/customerApi";

const STORAGE_KEY = "customers";

export function CustomerProvider({ children }) {
    // This provider wraps the whole app, so it also mounts on the public pages
    // where nobody is signed in. Fetching there is what used to break the staff
    // pages: the request went out with no Authorization header, came back 401,
    // and because the load ran once on mount and never again, signing in did not
    // retry it. So the load now waits until the session is known and repeats
    // whenever the token changes.
    const { token, checking } = useAuth();
    const canLoadCustomers = !checking && Boolean(token);

    const [customers, setCustomers] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }
        catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        if (!canLoadCustomers) {
            // Signed out, or still deciding: nothing to ask the server for. The
            // stored snapshot is dropped for the same reason a failed load drops
            // it — rows from a previous session must not masquerade as current.
            void Promise.resolve().then(() => {
                if (cancelled) return;
                setCustomers([]);
                setError(null);
                setLoading(false);
            });
            return () => { cancelled = true; };
        }

        const load = async () => {
            setLoading(true);
            try {
                // Fetch all registry rows newest-first so newly registered
                // customers (highest id) appear at the top of the list.
                // NB: the server caps a page at 100 rows, so this is "as many as
                // one page holds" rather than truly all of them.
                const data = await getCustomers({ page: 0, size: 2000, sort: 'id,desc' });
                const list = data.content || data;
                if (!cancelled) {
                    setCustomers(list);
                    setError(null);
                }
            }
            catch (err) {
                if (!cancelled) {
                    // Drop the cached snapshot. Keeping it would render customers
                    // that are not in the database, which is worse than an empty
                    // list because staff cannot tell the two apart.
                    setCustomers([]);
                    setError(err?.message || 'Failed to load customers');
                }
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        // Deferred to a microtask so the state updates above are not synchronous
        // inside the effect body, which would trigger a cascading render.
        void Promise.resolve().then(load);
        return () => { cancelled = true; };
    }, [canLoadCustomers, token]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
        }
        catch {
            // storage unavailable — keep the in-memory copy only
        }
    }, [customers]);

    const addCustomer = useCallback(async (customer) => {
        const created = await createCustomerApi(customer);
        setCustomers((prev) => [...prev, created]);
        return created;
    }, []);

    const updateCustomer = useCallback(async (id, updated) => {
        const data = await updateCustomerApi(id, updated);
        setCustomers((prev) => prev.map((c) => (c.id === id ? data : c)));
        return data;
    }, []);

    const deleteCustomer = useCallback(async (id) => {
        await deleteCustomerApi(id);
        setCustomers((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const value = { customers, loading, error, addCustomer, updateCustomer, deleteCustomer };

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
}