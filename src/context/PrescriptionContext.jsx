import { useCallback, useEffect, useState } from "react";
import { PrescriptionContext } from "@/context/PrescriptionContextStore";
import prescriptionData from "@/mockData/mockPrescriptions.json";

const STORAGE_KEY = "prescriptions";

// Legacy localStorage entries may hold the old API shape (customer_id, od_sphere,
// ...). If they do, ignore them and start from the seeded mock data instead.
const hasMockShape = (list) =>
    Array.isArray(list) &&
    list.length > 0 &&
    list.every((p) => p && Object.prototype.hasOwnProperty.call(p, "customerId"));

export function PrescriptionProvider({ children }) {
    const [prescriptions, setPrescriptions] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : null;
            return hasMockShape(parsed) ? parsed : prescriptionData;
        }
        catch {
            return prescriptionData;
        }
    });
    const loading = false;
    const error = null;

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
        return prescription;
    }, []);

    const updatePrescription = useCallback((id, updated) => {
        setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return updated;
    }, []);

    const deletePrescription = useCallback((id) => {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const value = { prescriptions, loading, error, addPrescription, updatePrescription, deletePrescription };

    return (
        <PrescriptionContext.Provider value={value}>
            {children}
        </PrescriptionContext.Provider>
    );
}