import api from "./api";

export async function fetchOrders(restaurantId) {
  const { data } = await api.get(`/api/orders`, {
    params: { restaurantId },
  });
  return data;
}

export async function placeOrder(payload) {
  const { data } = await api.post(`/api/orders`, payload);
  return data;
}

// Backward-compatible alias
export async function createOrder(payload) {
  return placeOrder(payload);
}


export async function patchOrderStatus(orderId, payload) {
  const { data } = await api.patch(`/api/orders/${orderId}/status`, payload);
  return data;
}

// Optional helper for tracking page (prefetch). If backend endpoint is not available,
// tracking page can rely solely on socket.
export async function fetchOrderById(orderId) {
  const { data } = await api.get(`/api/orders`, { params: { orderId } });
  // Expect backend may return filtered list.
  const list = data?.data || data;
  if (Array.isArray(list)) return list.find((o) => String(o.id) === String(orderId)) || null;
  return null;
}

