/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { getOrders, saveOrder, updateOrderStatus } from "../services/orderService";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => getOrders());

  function placeOrder(payload) {
    const order = saveOrder(payload);
    setOrders(getOrders());
    return order;
  }

  function setStatus(orderId, status, extra = {}) {
    const next = updateOrderStatus(orderId, status, extra);
    setOrders(next);
  }

  const history = orders.filter((order) => ["Cancelled", "Rejected", "Completed"].includes(order.status));
  const liveOrders = orders.filter((order) => !["Cancelled", "Rejected", "Completed"].includes(order.status));

  const value = useMemo(() => ({ orders, liveOrders, history, placeOrder, setStatus }), [orders, liveOrders, history]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
}
