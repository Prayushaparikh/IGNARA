// store/authStore.js
import { create } from "zustand";
import api from "../services/api.js";

export const useAuthStore = create((set) => ({
  user:    JSON.parse(localStorage.getItem("dp_user") || "null"),
  token:   localStorage.getItem("dp_token") || null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("dp_token", data.token);
      localStorage.setItem("dp_user",  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const status = err.response?.status;
      const backendError = err.response?.data?.error;
      const net =
        err.code === "ERR_NETWORK" ||
        err.message === "Network Error" ||
        (!err.response && err.request);
      const message =
        backendError ||
        (status
          ? `Login failed (${status}).`
          : err.code === "ECONNABORTED"
            ? "Request timed out — the API may be waking up (Render free tier can take ~1 min). Try again."
            : net
              ? "Can't reach the API. Set VITE_API_URL on Vercel to your Render URL, add this site's origin to CLIENT_URL on Render, redeploy, then retry (free tier may need ~1 min to wake)."
              : "Unable to reach server. Check connection and try again.");
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("dp_token", data.token);
      localStorage.setItem("dp_user",  JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const status = err.response?.status;
      const backendError = err.response?.data?.error;
      const net =
        err.code === "ERR_NETWORK" ||
        err.message === "Network Error" ||
        (!err.response && err.request);
      const message =
        backendError ||
        (status
          ? `Registration failed (${status}).`
          : err.code === "ECONNABORTED"
            ? "Request timed out — the API may be waking up (Render free tier can take ~1 min). Try again."
            : net
              ? "Can't reach the API. Set VITE_API_URL on Vercel to your Render URL, add this site's origin to CLIENT_URL on Render, redeploy, then retry (free tier may need ~1 min to wake)."
              : "Unable to reach server. Check connection and try again.");
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("dp_token");
    localStorage.removeItem("dp_user");
    set({ user: null, token: null });
  },
}));
