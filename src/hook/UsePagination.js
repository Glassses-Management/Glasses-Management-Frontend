import { useCallback, useState } from "react";

export function usePagination({initialPage = 0, onPageChange} = {}){
    const [page, setPage] = useState(initialPage);

    const goToPage = useCallback(
        (nextPage) => {
            setPage(nextPage);
            onPageChange?.(nextPage);
        }, [onPageChange]
    )

    const next = useCallback(() => goToPage(page + 1), [goToPage, page]);
    const prev = useCallback(() => goToPage(page - 1), [goToPage, page]);
    const reset = useCallback(() => goToPage(initialPage), [goToPage, initialPage]);

    return {page, goToPage, next ,prev, reset};
}