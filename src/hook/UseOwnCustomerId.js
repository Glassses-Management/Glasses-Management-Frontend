import { useEffect, useState } from "react";
import { useAuth } from "@/hook/UseAuth";
import { getMyCustomer } from "@/api/customerApi";

// Resolves the customer-profile id of the signed-in user.
//
// GET /api/auth/me returns a UserResponse (id, name, email, role, ...) with no
// customer_id field, so the user id is NOT the customer id. Sending the user id
// as customer_id makes the backend answer POST /api/orders with
// 404 "Customer not found" (see API_DOCUMENT.md section 10.1).
//
// The id now comes from GET /api/customers/me, which the backend resolves from
// the JWT. The previous version searched the staff list by email
// (GET /api/customers?email=...), which is closed to customers and let any
// account read another account's profile by changing the email.
//
// needsProfile is true when the backend answers 404, which is the state of a new
// Google signup: it has an account but no customer profile yet, because the
// customer table requires a phone number that Google does not supply.
export function useOwnCustomerId() {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const [state, setState] = useState(() => ({
        customerId: null,
        loading: true,
        error: null,
        needsProfile: false,
    }));

    useEffect(() => {
        let cancelled = false;

        // Run in a microtask so the state updates are not synchronous within the
        // effect body (same trick AuthContext uses for its first-load validation).
        const resolve = async () => {
            // Signed out (or not signed in yet): nothing to resolve.
            if (userId == null) {
                setState({ customerId: null, loading: false, error: null, needsProfile: false });
                return;
            }

            try {
                const profile = await getMyCustomer();
                if (cancelled) return;
                setState({
                    customerId: profile?.id ?? null,
                    loading: false,
                    error: null,
                    needsProfile: false,
                });
            }
            catch (err) {
                if (cancelled) return;
                if (err?.response?.status === 404) {
                    setState({
                        customerId: null,
                        loading: false,
                        error: null,
                        needsProfile: true,
                    });
                    return;
                }
                setState({
                    customerId: null,
                    loading: false,
                    error: err?.response?.data?.error || err?.message || "Failed to load your customer profile.",
                    needsProfile: false,
                });
            }
        };

        void Promise.resolve().then(resolve);
        return () => { cancelled = true; };
    }, [userId]);

    return state;
}
