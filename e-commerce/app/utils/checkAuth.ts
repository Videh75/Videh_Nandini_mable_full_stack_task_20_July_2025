import api from "~/api/axios";
import { useUserStore } from "~/store/user";

export const checkAuth = async () => {
  try {
    const res = await api.get("/validate");
    const email = res.data.message;
    if (email) {
      const setEmail = useUserStore.getState().setEmail;
      setEmail(email);
    }
  } catch (err) {
    // Invalid token, do nothing
  }
};
