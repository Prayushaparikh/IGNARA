// store/progressStore.js — API-backed foundation progress (replaces localStorage util)
import { create } from "zustand";
import api from "../services/api.js";

const DEFAULT_UNITS = {
  b1: { unlocked: true,  lessonRead: false, challenges: {}, projectDone: false },
  b2: { unlocked: false, lessonRead: false, challenges: {}, projectDone: false },
  b3: { unlocked: false, lessonRead: false, challenges: {}, projectDone: false },
  b4: { unlocked: false, lessonRead: false, challenges: {}, projectDone: false },
};

export const useProgressStore = create((set, get) => ({
  units:   null,   // null = not yet fetched
  loading: false,
  error:   null,

  /** Fetch latest progress from the server */
  sync: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/progress/foundation");
      set({ units: data.units, loading: false });
    } catch {
      // Fall back to defaults so the UI still works (e.g. user not logged in yet)
      if (!get().units) set({ units: DEFAULT_UNITS });
      set({ error: "Could not load progress", loading: false });
    }
  },

  /** Optimistically mark a lesson as read, then persist */
  markLessonRead: async (unitId) => {
    const lower = unitId.toLowerCase();
    set((s) => ({
      units: s.units
        ? { ...s.units, [lower]: { ...(s.units[lower] || {}), lessonRead: true } }
        : s.units,
    }));
    try {
      await api.patch(`/progress/foundation/${lower}`, { lessonRead: true });
    } catch {
      // Non-critical — progress re-syncs on next page load
    }
  },

  /** Optimistically mark a project done, then re-sync to unlock next unit */
  markProjectDone: async (unitId) => {
    const lower = unitId.toLowerCase();
    set((s) => ({
      units: s.units
        ? { ...s.units, [lower]: { ...(s.units[lower] || {}), projectDone: true } }
        : s.units,
    }));
    try {
      await api.patch(`/progress/foundation/${lower}`, { projectDone: true });
      await get().sync(); // re-fetch so next unit becomes unlocked
    } catch {
      // Non-critical
    }
  },

  /** Local-only update after a successful challenge submission (backend already persisted it) */
  markChallengePassedLocal: (unitId, challengePos) => {
    const lower = unitId.toLowerCase();
    set((s) => {
      if (!s.units) return s;
      const unit = s.units[lower] || {};
      return {
        units: {
          ...s.units,
          [lower]: {
            ...unit,
            challenges: { ...(unit.challenges || {}), [String(challengePos)]: true },
          },
        },
      };
    });
  },
}));
