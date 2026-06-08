import { buildOrderId } from "../utils/format";
import { getStoredValue, setStoredValue } from "../utils/storage";
import api from "./api";

const ORDER_KEY = "scan2order_orders";

export function getOrders() {
  return getStoredValue(ORDER_KEY, []);
}

export function saveOrder(order) {
  const nextOrder = {
    ...order,
    id: order.id || buildOrderId(),
    status: order.status || "New",
    paymentStatus: order.paymentStatus || (order.paymentType === "Pay Now" ? "Pending" : "Pay Later"),
    createdAt: order.createdAt || new Date().toISOString(),
    statusHistory: [
      {
        status: order.status || "New",
        at: new Date().toISOString(),
      },
    ],
  };
  setStoredValue(ORDER_KEY, [nextOrder, ...getOrders()]);
  return nextOrder;
}

export function updateOrderStatus(orderId, status, extra = {}) {
  const orders = getOrders().map((order) =>
    order.id === orderId
      ? {
          ...order,
          ...extra,
          status,
          updatedAt: new Date().toISOString(),
          statusHistory: [...(order.statusHistory || []), { status, at: new Date().toISOString() }],
        }
      : order,
  );
  setStoredValue(ORDER_KEY, orders);
  return orders;
}

export async function fetchOrders(restaurantId) {
  const { data } = await api.get(`/api/orders/${restaurantId}`);
  return data;
}

export async function createOrder(payload) {
  const { data } = await api.post("/api/orders", payload);
  return data;
}

export async function patchOrderStatus(orderId, payload) {
  const { data } = await api.patch(`/api/orders/${orderId}/status`, payload);
  return data;
}
