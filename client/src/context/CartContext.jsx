/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStoredValue, setStoredValue } from "../utils/storage";

const CartContext = createContext(null);
const CART_KEY = "scan2order_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => getStoredValue(CART_KEY, { restaurantId: null, table: null, items: [] }));

  useEffect(() => {
    setStoredValue(CART_KEY, cart);
  }, [cart]);

  function addItem(item, restaurantId, table) {
    setCart((current) => {
      const sameRestaurant = !current.restaurantId || String(current.restaurantId) === String(restaurantId);
      const base = sameRestaurant ? current : { restaurantId, table, items: [] };
      const exists = base.items.find((row) => row.id === item.id);
      const items = exists
        ? base.items.map((row) => (row.id === item.id ? { ...row, quantity: row.quantity + 1 } : row))
        : [...base.items, { ...item, quantity: 1 }];
      return { ...base, restaurantId, table, items };
    });
  }

  function updateQuantity(itemId, quantity) {
    setCart((current) => ({
      ...current,
      items: current.items
        .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    }));
  }

  function increaseQuantity(itemId) {
    setCart((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)),
    }));
  }

  function decreaseQuantity(itemId) {
    setCart((current) => ({
      ...current,
      items: current.items
        .map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0),
    }));
  }

  function removeItem(itemId) {
    setCart((current) => ({ ...current, items: current.items.filter((item) => item.id !== itemId) }));
  }

  function clearCart() {
    setCart({ restaurantId: null, table: null, items: [] });
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({ cart, subtotal, itemCount, addItem, updateQuantity, increaseQuantity, decreaseQuantity, removeItem, clearCart }),
    [cart, subtotal, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
