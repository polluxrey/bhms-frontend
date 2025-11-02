import { useEffect } from "react";
import { refreshAccessToken } from "../services/authService";

export default function useAuthRefresh() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await refreshAccessToken();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
