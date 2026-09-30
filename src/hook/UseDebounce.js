import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms, so callers
// can filter or search on the settled value instead of every keystroke.
export function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay])

    return debounced;
}
