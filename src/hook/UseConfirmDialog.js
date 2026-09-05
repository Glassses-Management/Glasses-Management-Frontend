import { useCallback, useState } from "react";

export function useConfirmDialog(){
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState({title: '', message: '', onConfirm: null});

    const confirm = useCallback(({title = 'Are you sure?', message = '', onConfirm}) => {
        setConfig({title, message, onConfirm});
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const handleConfirm = useCallback(() => {
        config.onConfirm?.();
        setOpen(false);
    }, [config]);

    return {open, config, confirm, close, handleConfirm};
}
