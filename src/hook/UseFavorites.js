import { useContext } from 'react';
import { FavoritesContext } from '@/context/FavoritesContextStore';

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error('useFavorites must be used inside a <FavoritesProvider>');
    }
    return ctx;
}
