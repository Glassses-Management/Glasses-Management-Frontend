import { useCallback, useState } from "react";
import { ToastContext } from "@/context/ToastContext";

let idCounter = 0;

export function ToastProvider({children }){
    const [toast, setToast] = useState([]);

    const dismiss = useCallback((id) => {
        setToast((prev) => prev.filter((toast) => toast.id != id))
    }, []);

    const show = useCallback(
        (message, type = 'info', duration = 3000) => {
            const id = ++idCounter;
            setToast((prev) => [...prev, {id, message, type}]);
            if(duration > 0){
                setTimeout(() => dismiss(id), duration);
            }
            return id;
        }, [dismiss]
    )

    const success = useCallback((msg, otps) => show(msg, 'success', otps), [show]);
    const error = useCallback((msg, otps) => show (msg, 'error', otps), [show]);
    const warning = useCallback((msg, otps) => show(msg, 'warning', otps), [show]);

    const value = { toast, show, success, error, warning, dismiss }

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
}