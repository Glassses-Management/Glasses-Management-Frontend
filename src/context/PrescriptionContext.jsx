import { useCallback, useEffect, useState } from "react";
import { PrescriptionContext } from "@/context/PrescriptionContextStore";
import {
  getPrescriptions,
  createPrescription as createPrescriptionApi,
  updatePrescription as updatePrescriptionApi,
  deletePrescription as deletePrescriptionApi,
} from "@/api/prescriptionApi";

const STORAGE_KEY = "prescriptions";

export function PrescriptionProvider({ children }) {
    const [prescriptions, setPrescriptions] = useState(() => {
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
                const data = await getPrescriptions();
                if (!cancelled) {
                    setPrescriptions(data);
                    setError(null);
                }
            }
            catch (err) {
                if (!cancelled) {
                    setError(err?.message || 'Failed to load prescriptions');
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prescriptions));
        }
        catch {
            // storage unavailable — keep the in-memory copy only
        }
    }, [prescriptions]);

    const addPrescription = useCallback(async (prescription) => {
        const created = await createPrescriptionApi(prescription);
        setPrescriptions((prev) => [...prev, created]);
        return created;
    }, []);

    const updatePrescription = useCallback(async (id, updated) => {
        const data = await updatePrescriptionApi(id, updated);
        setPrescriptions((prev) => prev.map((p) => (p.id === id ? data : p)));
        return data;
    }, []);

    const deletePrescription = useCallback(async (id) => {
        await deletePrescriptionApi(id);
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const value = { prescriptions, loading, error, addPrescription, updatePrescription, deletePrescription };

    return (
        <PrescriptionContext.Provider value={value}>
            {children}
        </PrescriptionContext.Provider>
    );
}