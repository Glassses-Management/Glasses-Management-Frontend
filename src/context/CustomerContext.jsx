import { useCallback, useEffect, useState } from "react";
import { CustomerContext } from "@/context/CustomerContextStore";
import mockCustomers from "@/mockData/mockCustomers.json";

// Single source of truth for customer data. Seeded from the mock JSON, written
// to localStorage like AuthContext does for the user, so edits/creates/deletes
// survive a page reload. Every page reads the same list through useCustomers().
const STORAGE_KEY = "customers";

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : mockCustomers.customers;
        }
        catch {
            return mockCustomers.customers;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
        }
        catch {
            // storage unavailable — keep the in-memory copy only
        }
    }, [customers]);

    const addCustomer = useCallback((customer) => {
        setCustomers((prev) => [...prev, customer]);
    }, []);

    const updateCustomer = useCallback((updated) => {
        setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }, []);

    const deleteCustomer = useCallback((id) => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const value = { customers, addCustomer, updateCustomer, deleteCustomer };

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
}