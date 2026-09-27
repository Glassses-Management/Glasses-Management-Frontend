import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoritesContext } from '@/context/FavoritesContextStore';
import { useAuth } from '@/hook/UseAuth';
import { getFavorites, addFavorite, removeFavorite } from '@/api/favoriteApi';

// Owns the customer's wishlist for the whole app.
//
// The list is fetched once per session and kept as a Set of product ids, so a
// product grid of any size answers isFavorite() from memory. Asking the server
// per card would mean one request per product on every page.
//
// No request is made while signed out: the endpoints require a customer token and
// the call would only produce a 401.
export function FavoritesProvider({ children }) {
    const { token, user } = useAuth();
    const isCustomer = String(user?.role || '').toUpperCase().replace(/^ROLE_/, '') === 'CUSTOMER';

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const canUseFavorites = Boolean(token) && isCustomer;

    useEffect(() => {
        if (!canUseFavorites) {
            // Signed out, or a staff account: nothing to show, and nothing saved
            // here belongs to this session. The microtask hop is the same one
            // AuthContext uses, because setting state in an effect body causes a
            // cascading render. Returning the previous array when already empty
            // avoids waking every consumer for nothing.
            void Promise.resolve().then(() => {
                setFavorites((prev) => (prev.length ? [] : prev));
            });
            return;
        }

        // No "already loading" latch here on purpose. Under StrictMode the effect
        // is invoked twice: the first run's cleanup sets cancelled, and a latch
        // left set by that first run would make the second run return early
        // without scheduling anything. The queued load would then finish with
        // cancelled === true, so neither setFavorites nor setLoading(false) would
        // ever run and the page would sit on "Loading..." forever. The cancelled
        // flag below is what actually guards correctness; the only cost of dropping
        // the latch is one extra idempotent GET in development.
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const rows = await getFavorites();
                if (!cancelled) {
                    setFavorites(rows);
                }
            } catch {
                // A failed load must not break the storefront: the hearts simply
                // render as unselected and the customer can try again.
                if (!cancelled) {
                    setFavorites([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        void Promise.resolve().then(load);

        return () => { cancelled = true; };
    }, [canUseFavorites]);

    // A Set keeps isFavorite O(1) no matter how long the wishlist grows.
    const favoriteIds = useMemo(
        () => new Set(favorites.map((row) => Number(row.productId ?? row.product?.id))),
        [favorites],
    );

    const isFavorite = useCallback(
        (productId) => favoriteIds.has(Number(productId)),
        [favoriteIds],
    );

    /**
     * Adds or removes a product. The heart is updated first and reverted if the
     * request fails, so the click feels instant without lying about the result.
     * Throws on failure so the caller can surface a message.
     */
    const toggle = useCallback(
        async (productId) => {
            const id = Number(productId);
            const wasFavorite = favoriteIds.has(id);

            setFavorites((prev) => {
                if (wasFavorite) {
                    return prev.filter((row) => Number(row.productId ?? row.product?.id) !== id);
                }
                // Placeholder row so the heart fills instantly; replaced by the
                // server's response below.
                return [{ productId: id, pending: true }, ...prev];
            });

            try {
                if (wasFavorite) {
                    await removeFavorite(id);
                } else {
                    const saved = await addFavorite(id);
                    // The placeholder row has no product details, so pull the list
                    // again to get the record the wishlist grid renders from.
                    // Only trusted if it really contains this product, otherwise a
                    // failed or oddly shaped response would empty the wishlist.
                    const rows = await getFavorites().catch(() => null);
                    const hasSaved = rows?.some(
                        (row) => Number(row.productId ?? row.product?.id) === id,
                    );
                    if (hasSaved) {
                        setFavorites(rows);
                    } else {
                        setFavorites((prev) => prev.map((row) =>
                            Number(row.productId) === id ? { ...saved, productId: id } : row,
                        ));
                    }
                }
                return !wasFavorite;
            } catch (err) {
                setFavorites((prev) => {
                    const without = prev.filter(
                        (row) => Number(row.productId ?? row.product?.id) !== id,
                    );
                    return wasFavorite ? [...without, prev.find(
                        (row) => Number(row.productId ?? row.product?.id) === id,
                    )].filter(Boolean) : without;
                });
                throw err;
            }
        },
        [favoriteIds],
    );

    const value = useMemo(
        () => ({ favorites, favoriteIds, isFavorite, toggle, loading, canUseFavorites }),
        [favorites, favoriteIds, isFavorite, toggle, loading, canUseFavorites],
    );

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
