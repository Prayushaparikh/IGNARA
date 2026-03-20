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
      set({ error: err.response?.data?.error || "Login failed", loading: false });
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
      set({ error: err.response?.data?.error || "Registration failed", loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("dp_token");
    localStorage.removeItem("dp_user");
    set({ user: null, token: null });
  },
}));
