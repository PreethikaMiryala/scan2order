import api from "./api";

const ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY || "SCAN2ORDER_ADMIN";

export async function loginAdmin({ email, password, accessKey }) {
  if (!accessKey || accessKey.trim() !== ACCESS_KEY) {
    throw new Error("Invalid access key");
  }

  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function registerRestaurant(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export function beginGoogleOAuth() {
  return {
    message: "Google OAuth UI is ready. Connect the backend OAuth endpoint to enable sign-in.",
  };
}

export function getAccessKeyHint() {
  return ACCESS_KEY === "SCAN2ORDER_ADMIN" ? "Default demo key: SCAN2ORDER_ADMIN" : "Use your configured admin access key";
}
