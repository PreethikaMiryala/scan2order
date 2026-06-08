import api from "./api";
import { buildLocalAnalytics } from "./analyticsService";

export async function fetchAdminStats(restaurantId) {
  const { data } = await api.get(`/api/admin/stats/${restaurantId}`);
  return data;
}

export function buildLocalAdminStats(orders) {
  return buildLocalAnalytics(orders);
}
