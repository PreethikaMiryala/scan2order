export function currency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function normalizeMenuItems(payload, restaurantId) {
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return rows
    .filter((item) => !restaurantId || String(item.restaurant_id) === String(restaurantId))
    .map((item) => ({
      id: item.id,
      restaurant_id: item.restaurant_id,
      category: item.category || "Chef's Selection",
      name: item.name || "Untitled item",
      description: item.description || "A seasonal composition prepared by the kitchen.",
      price: Number(item.price || 0),
      image_url: item.image_url || "",
      available: item.available !== false,
    }));
}

export function buildOrderId() {
  return `S2O-${Date.now().toString(36).toUpperCase()}`;
}

export function getInitials(value = "Scan2Order") {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
