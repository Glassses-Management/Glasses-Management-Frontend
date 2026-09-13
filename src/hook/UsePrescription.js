import { useContext } from "react";
import { PrescriptionContext } from "@/context/PrescriptionContextStore";

export function usePrescriptions() {
    const ctx = useContext(PrescriptionContext);
    if (!ctx) {
        throw new Error('usePrescriptions must be used inside a <PrescriptionProvider>');
    }
    return ctx;
}