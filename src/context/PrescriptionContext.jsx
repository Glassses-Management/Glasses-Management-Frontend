import { useCallback, useEffect, useState } from "react";
import { PrescriptionContext } from "@/context/PrescriptionContextStore";
import mockPrescriptions from "@/mockData/mockPrescriptions.json";

// Single source of truth for prescription data. Seeded from the mock JSON,
// written to localStorage like CustomerContext does, so edits/creates survive
// a page reload. Every prescription page reads the same list via usePrescriptions().
const STORAGE_KEY = "prescriptions";

export function PrescriptionProvider({ children }) {
    const [prescriptions, setPrescriptions] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : mockPrescriptions;
        }
        catch {
            return mockPrescriptions;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
        }
        catch {
            // storage unavailable — keep the in-memory copy only
        }
    }, [prescriptions]);

    const addPrescription = useCallback((prescription) => {
        setPrescriptions((prev) => [...prev, prescription]);
    }, []);

    const updatePrescription = useCallback((updated) => {
        setPrescriptions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }, []);

    const value = { prescriptions, addPrescription, updatePrescription };

    return (
        <PrescriptionContext.Provider value={value}>
            {children}
        </PrescriptionContext.Provider>
    );
}