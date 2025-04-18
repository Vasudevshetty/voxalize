import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
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
  const [errors, setErrors] = useState({
    login: null,
    signup: null,
    logout: null,
    forgotPassword: null,
    resetPassword: null,
  });

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
    setErrors((prev) => ({ ...prev, login: null }));
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed.";
      setErrors((prev) => ({ ...prev, login: message }));
      setIsAuthenticated(false);
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const signup = async ({ email, password, username, mobileNumber }) => {
    setErrors((prev) => ({ ...prev, signup: null }));
    setLoading((prev) => ({ ...prev, signup: true }));
    try {
      const res = await api.post("/api/v1/auth/signup", {
        email,
        password,
        username,
        mobileNumber,
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Signup failed.";
      setErrors((prev) => ({ ...prev, signup: message }));
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const logout = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    try {
      await api.get("/api/v1/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || "Logout failed.";
      setErrors((prev) => ({ ...prev, logout: message }));
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const forgotPassword = async (email) => {
    setErrors((prev) => ({ ...prev, forgotPassword: null }));
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to send reset email.";
      setErrors((prev) => ({ ...prev, forgotPassword: message }));
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  };

  const resetPassword = async ({ token, password }) => {
    setErrors((prev) => ({ ...prev, resetPassword: null }));
    setLoading((prev) => ({ ...prev, resetPassword: true }));
    try {
      await api.post(`/api/v1/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to reset password.";
      setErrors((prev) => ({ ...prev, resetPassword: message }));
      return { success: false, message };
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    errors, // Provide the individual error states
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
