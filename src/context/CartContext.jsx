import { useCallback, useEffect, useState } from "react";
import { CartContext } from "@/context/CartContextStore";

const STORAGE_KEY = "cart";

function loadCart() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }
    catch {
        return [];
    }
}

function toQuantity(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
        catch {
            // storage unavailable — keep the in-memory copy only
        }
    }, [items]);

    const addItem = useCallback((product, quantity = 1) => {
        const productId = product?.id ?? product?.product_id;
        if (productId == null) return;
        const qty = toQuantity(quantity);
        setItems((prev) => {
            const existing = prev.find((i) => i.product_id === productId);
            if (existing) {
                return prev.map((i) =>
                    i.product_id === productId
                        ? { ...i, quantity: (Number(i.quantity) || 0) + qty }
                        : i,
                );
            }
            return [
                ...prev,
                {
                    product_id: productId,
                    quantity: qty,
                    product: {
                        id: productId,
                        model: product.model,
                        brand: product.brand,
                        sku: product.sku,
                        color: product.color,
                        size: product.size,
                        sale_price: product.sale_price,
                    },
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        const qty = Number(quantity);
        setItems((prev) => {
            if (!Number.isFinite(qty) || qty <= 0) {
                return prev.filter((i) => i.product_id !== productId);
            }
            return prev.map((i) =>
                i.product_id === productId ? { ...i, quantity: Math.floor(qty) } : i,
            );
        });
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((prev) => prev.filter((i) => i.product_id !== productId));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const count = items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    const subtotal = items.reduce(
        (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.product?.sale_price) || 0),
        0,
    );

    const value = { items, count, subtotal, addItem, updateQuantity, removeItem, clearCart };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}