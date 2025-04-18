import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState({
    getMe: true,
    login: false,
    logout: false,
    signup: false,
    forgotPassword: false,
    resetPassword: false,
  });
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading((prev) => ({ ...prev, getMe: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    setError(null);
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed.";
      setError(message);
      setIsAuthenticated(false);
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const signup = async ({ email, password, username }) => {
    setError(null);
    setLoading((prev) => ({ ...prev, signup: true }));
    try {
      const res = await api.post("/api/v1/auth/signup", {
        email,
        password,
        username,
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Signup failed.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const logout = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    try {
      await api.post("/api/v1/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Logout failed.";
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to send reset email.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  };

  const resetPassword = async ({ token, password }) => {
    setError(null);
    setLoading((prev) => ({ ...prev, resetPassword: true }));
    try {
      await api.post(`/api/v1/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to reset password.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
