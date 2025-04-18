import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({
    getMe: true,
    login: false,
    signup: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading((prev) => ({ ...prev, getMe: false }));
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed.");
      return { success: false, message: error };
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const signup = async ({ username, email, password }) => {
    setError(null);
    setLoading((prev) => ({ ...prev, signup: true }));
    try {
      const res = await api.post("/api/v1/auth/signup", {
        username,
        email,
        password,
      });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed.");
      return { success: false, message: error };
    } finally {
      setLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const logout = async () => {
    setLoading((prev) => ({ ...prev, logout: true }));
    try {
      await api.post("/api/v1/auth/logout");
      setUser(null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Logout failed.",
      };
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const forgotPassword = async (email) => {
    setLoading((prev) => ({ ...prev, forgotPassword: true }));
    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to send reset link.",
      };
    } finally {
      setLoading((prev) => ({ ...prev, forgotPassword: false }));
    }
  };

  const resetPassword = async (token, password) => {
    setLoading((prev) => ({ ...prev, resetPassword: true }));
    try {
      await api.post(`/api/v1/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Password reset failed.",
      };
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
