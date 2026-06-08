import { useEffect, useState } from "react";
import { fetchMenuItems } from "../services/menuService";

export function useMenu(restaurantId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(restaurantId));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMenu() {
      if (!restaurantId) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const rows = await fetchMenuItems(restaurantId);
        if (active) setItems(rows);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || err.message || "Unable to load menu");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMenu();
    return () => {
      active = false;
    };
  }, [restaurantId]);

  return { items, setItems, loading, error };
}
