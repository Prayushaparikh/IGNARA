import axios from "axios";

/** When VITE_API_URL is unset, use production API (not a stale EC2 IP). */
const FALLBACK_API_URL = "https://ignara-api.onrender.com";
const configuredApiUrl = import.meta.env.VITE_API_URL || FALLBACK_API_URL;
const isHttpsPage = typeof window !== "undefined" && window.location.protocol === "https:";
const isConfiguredUrlInsecure = configuredApiUrl.startsWith("http://");

// On HTTPS deployments, avoid mixed-content by using same-origin /api proxy.
const baseURL = isHttpsPage && isConfiguredUrlInsecure
  ? "/api"
  : `${configuredApiUrl}/api`;

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
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
