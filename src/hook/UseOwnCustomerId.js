import { useEffect, useState } from "react";
import { useAuth } from "@/hook/UseAuth";
import { getCustomers } from "@/api/customerApi";

// Resolves the customer-profile id of the signed-in user.
//
// GET /api/auth/me returns a UserResponse (id, name, email, role, ...) with no
// customer_id field, so the user id is NOT the customer id. Sending the user id
// as customer_id makes the backend answer POST /api/orders with
// 404 "Customer not found" (see API_DOCUMENT.md section 10.1).
// If a future backend adds customer_id to the response, it is used directly and
// no lookup happens.
export function useOwnCustomerId() {
    const { user } = useAuth();

    const directId = user?.customer_id ?? null;
    const email = user?.email ?? null;
    const needsLookup = directId == null && email != null;

    const [state, setState] = useState(() => ({
        customerId: directId,
        loading: needsLookup,
        error: null,
    }));

    useEffect(() => {
        let cancelled = false;

        // Run in a microtask so the state updates are not synchronous within the
        // effect body (same trick AuthContext uses for its first-load validation).
        const resolve = async () => {
            if (directId != null) {
                setState({ customerId: directId, loading: false, error: null });
                return;
            }

            if (!email) {
                setState({ customerId: null, loading: false, error: "No email on this account." });
                return;
            }

            setState({ customerId: null, loading: true, error: null });

            try {
                const data = await getCustomers({ email, page: 0, size: 5 });
                const list = Array.isArray(data) ? data : data?.content || [];
                // The email filter is a case-insensitive LIKE, so compare exactly
                // instead of trusting the first row.
                const match = list.find(
                    (c) => String(c?.email || "").toLowerCase() === email.toLowerCase(),
                );

                if (cancelled) return;
                setState({
                    customerId: match?.id ?? null,
                    loading: false,
                    error: match ? null : "No customer profile matches this account's email.",
                });
            }
            catch (err) {
                if (cancelled) return;
                setState({
                    customerId: null,
                    loading: false,
                    error: err?.message || "Failed to load your customer profile.",
                });
            }
        };

        void Promise.resolve().then(resolve);
        return () => { cancelled = true; };
    }, [directId, email]);

    return state;
}
