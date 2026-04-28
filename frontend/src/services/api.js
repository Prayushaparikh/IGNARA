import axios from "axios";

// On HTTPS (Vercel production): always use the same-origin /api proxy.
// vercel.json rewrites /api/(.*)  →  https://ignara-api.onrender.com/api/$1
// This avoids mixed-content errors AND removes the need for CORS on Render.
//
// Local dev should prefer same-origin /api so Vite proxy handles backend routing.
// This avoids CORS/host mismatch issues (localhost vs 127.0.0.1, stale API host, etc).
// Opt in to direct backend calls only when explicitly requested.
const isHttpsPage = typeof window !== "undefined" && window.location.protocol === "https:";
const DEV_API_URL  = import.meta.env.VITE_API_URL;
const USE_DIRECT_API = import.meta.env.VITE_API_MODE === "direct";
const baseURL =
  isHttpsPage
    ? "/api"
    : (USE_DIRECT_API && DEV_API_URL ? `${DEV_API_URL}/api` : "/api");

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || "";
    const isAuthRequest =
      requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("dp_token");
      localStorage.removeItem("dp_user");
      const loginPath = window.location.protocol === "https:" ? "/login" : "/#/login";
      window.location.href = loginPath;
    }
    return Promise.reject(err);
  }
);

export default api;
