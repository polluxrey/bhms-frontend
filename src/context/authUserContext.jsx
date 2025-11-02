import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/authService";
import { fetchCurrentUser } from "../services/userService";

const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const result = await fetchCurrentUser();
      if (result?.success && result.data?.id) {
        setUser(result.data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasToken = localStorage.getItem("access_token");

    if (hasToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(credentials);
      if (!result.success) throw new Error(result.error || "Login failed");
      await fetchUser();
      return { success: true };
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthUserContext.Provider
      value={{ user, isLoggedIn, loading, error, login, logout }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context)
    throw new Error("useAuthUser must be used within AuthUserProvider");
  return context;
};
