import api from "./api";

export async function fetchAnalytics(restaurantId) {
  const { data } = await api.get(`/api/analytics/${restaurantId}`);
  return data;
}

export function buildLocalAnalytics(orders = []) {
  const activeOrders = orders.filter((order) => !["Cancelled", "Rejected", "Completed"].includes(order.status));
  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");

  return {
    activeOrders: activeOrders.length,
    revenue: paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    tablesActive: new Set(activeOrders.map((order) => order.table)).size,
    totalOrders: orders.length,
  };
}
