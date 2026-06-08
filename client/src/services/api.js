import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("scan2order_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("scan2order_token");
      localStorage.removeItem("scan2order_user");
      localStorage.removeItem("scan2order_access_key_valid");
      localStorage.setItem("scan2order_session_expired", "true");
      window.dispatchEvent(new Event("scan2order:session-expired"));
    }
    return Promise.reject(error);
  },
);

export default api;
