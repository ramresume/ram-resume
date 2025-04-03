// client/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useApi } from "../hooks/useApi";
import toast from "react-hot-toast";

const AuthContext = createContext();

// Helper to save token to localStorage
const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

// Helper to get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Helper to remove token from localStorage
const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewLogin, setIsNewLogin] = useState(false);
  const [usage, setUsage] = useState(null);
  const [usageError, setUsageError] = useState("");
  const router = useRouter();
  const { request } = useApi();

  const loadUser = useCallback(async () => {
    try {
      const userData = await request("/api/user");
      setUser(userData);

      // Check terms status after login
      if (userData && isNewLogin) {
        if (!userData.hasAcceptedTerms) {
          router.push("/terms");
          toast.error("Please accept the terms to continue");
        } else {
          toast.success(`Welcome back, ${userData.firstName}!`);
        }
        setIsNewLogin(false);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);

      // Remove token if authentication failed
      if (error.response?.status === 401) {
        removeToken();
      }

      // Handle terms-specific errors
      if (error.response?.status === 403 && error.response?.data?.requiresTerms) {
        router.push("/terms");
      }
    } finally {
      setLoading(false);
    }
  }, [request, router, isNewLogin]);

  const acceptTerms = useCallback(async () => {
    try {
      await request("/auth/accept-terms", {
        method: "POST",
      });
      await loadUser();
      router.push("/");
      toast.success("Terms accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept terms. Please try again.");
    }
  }, [request, router, loadUser]);

  const login = useCallback(() => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`;
    window.open(url, "googleLoginPopup", `width=${width},height=${height},left=${left},top=${top}`);
  }, []);

  const checkUsage = useCallback(async () => {
    setUsageError(""); // Clear previous errors

    try {
      // If user isn't loaded yet, wait a moment and retry
      if (!user) {
        await loadUser();
        if (!user) {
          setUsageError("User authentication required");
          return false;
        }
      }

      const usageData = await request("/api/usage", { method: "GET" });
      setUsage(usageData);

      if (usageData.remainingUses <= 0) {
        const resetDate = new Date(usageData.resetDate);
        const formattedDate = resetDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        setUsageError(`Your tokens will reset on ${formattedDate}.`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking usage:", error);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setUsageError("Please log in to check your usage");
        removeToken();
        return false;
      }

      // Set a more user-friendly error message
      setUsageError("Unable to check usage limits. Please try refreshing the page.");
      return false;
    }
  }, [request, user, loadUser]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await request("/auth/logout", { method: "GET" });
      setUser(null);
      removeToken(); // Remove token on logout
      router.push("/");
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [request, router]);

  useEffect(() => {
    // Attempt to load user if there's a token
    if (getToken()) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== process.env.NEXT_PUBLIC_SERVER_URL) return;

      if (event.data.type === "LOGIN_SUCCESS") {
        // Store the JWT token
        if (event.data.token) {
          saveToken(event.data.token);
          console.log("JWT token received and saved");
        } else {
          console.error("No token received in login success message");
        }

        setIsNewLogin(true);
        loadUser();
        if (event.data.requiresTerms) {
          router.push("/terms");
        }
      } else if (event.data.type === "LOGIN_ERROR") {
        setError(event.data.message);
        toast.error(event.data.message || "Failed to login");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [loadUser, router]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    acceptTerms,
    usage,
    usageError,
    checkUsage,
    getToken, // Expose token getter
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
