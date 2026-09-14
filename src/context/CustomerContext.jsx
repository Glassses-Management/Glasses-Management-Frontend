import { useCallback, useEffect, useState } from "react";
import { CustomerContext } from "@/context/CustomerContextStore";
import { getCustomers, createCustomer as createCustomerApi, updateCustomer as updateCustomerApi, deleteCustomer as deleteCustomerApi } from "@/api/customerApi";

const STORAGE_KEY = "customers";

export function CustomerProvider({ children }) {
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
        const load = async () => {
            try {
                const data = await getCustomers();
                const list = data.content || data;
                if (!cancelled) {
                    setCustomers(list);
                    setError(null);
                }
            }
            catch (err) {
                if (!cancelled) {
                    setError(err?.message || 'Failed to load customers');
                }
            }
            finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        void load();
        return () => { cancelled = true; };
    }, []);

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