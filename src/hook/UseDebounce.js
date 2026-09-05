import { useEffect, useState } from "react";

export function useDebouce(value, delay = 300){
    const [debounce, setDebounce] = useState();

    useEffect(() => {
        const handler = setTimeout(() => setDebounce(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay])

    return debounce;
}