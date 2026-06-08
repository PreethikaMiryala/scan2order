import api from "./api";
import { normalizeMenuItems } from "../utils/format";

export async function fetchMenuItems(restaurantId) {
  const { data } = await api.get(`/api/menu/${restaurantId}`);
  return normalizeMenuItems(data, restaurantId);
}

export async function createMenuItem(payload) {
  const { data } = await api.post("/api/menu", payload);
  return data?.data || data;
}

export async function updateMenuItem(itemId, payload) {
  const { data } = await api.patch(`/api/menu/${itemId}`, payload);
  return data?.data || data;
}

export async function deleteMenuItem(itemId) {
  const { data } = await api.delete(`/api/menu/${itemId}`);
  return data;
}
