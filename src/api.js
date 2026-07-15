import axios from "axios";

// All requests go through /api (proxied by Vite in dev, nginx in production)
const api = axios.create({ baseURL: "/api" });

// Attach the JWT to every request when logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Extract a readable message from FastAPI error responses
export function errorMessage(err) {
  const d = err?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x.msg).join("، ");
  return "خطایی رخ داد؛ دوباره تلاش کنید.";
}

export default api;
