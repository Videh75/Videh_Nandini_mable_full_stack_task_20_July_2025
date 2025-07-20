import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  email: string;
  sessionId: string;
  setEmail: (email: string) => void;
  setSessionId: (sessionId: string) => void;
};

export const useUserStore = create(
  persist(
    (set): UserState => ({
      email: "",
      sessionId: "",
      setEmail: (email) => set({ email }),
      setSessionId: (sessionId) => set({ sessionId }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        email: state.email,
        sessionId: state.sessionId,
      }),
    }
  )
);
