// store/authStore.js
import { create } from "zustand";
import api from "../services/api.js";

function parseBackendError(err) {
  const status = err.response?.status;
  const raw = err.response?.data?.error;
  if (raw) {
    // Backend may return Zod errors as a JSON string — parse and humanise
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(e => e.message).join(" · ");
      }
    } catch (_) { /* not JSON, use as-is */ }
    return raw;
  }
  if (status) return `Request failed (${status}).`;
  if (err.code === "ECONNABORTED") return "Request timed out — the API may be waking up. Try again in 30 seconds.";
  return "Unable to reach server. Check connection and try again.";
}

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
      set({ error: parseBackendError(err), loading: false });
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
      set({ error: parseBackendError(err), loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("dp_token");
    localStorage.removeItem("dp_user");
    set({ user: null, token: null });
  },
}));
