// client/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
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
  const isLoadingRef = useRef(false);
  
  // Create API client without using useAuth to avoid circular dependency
  const apiClient = {
    request: async (endpoint, options = {}) => {
      try {
        // Ensure endpoint starts with a slash but doesn't create a double slash
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        // Fix the URL to avoid double slashes
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const url = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${normalizedEndpoint}`;
        
        const headers = {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        };

        // Add auth token if available
        const token = getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw { 
              response: {
                status: response.status,
                data: errorData
              },
              message: errorData.error || `Request failed with status ${response.status}`
            };
          } else {
            throw { 
              response: {
                status: response.status
              },
              message: `Request failed with status ${response.status}`
            };
          }
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (error) {
        console.error("API request error:", error);
        throw error;
      }
    }
  };

  const loadUser = useCallback(async () => {
    // Prevent multiple simultaneous loading attempts
    if (isLoadingRef.current) {
      console.log("Already loading user data, skipping duplicate request");
      return;
    }
    
    console.log("Attempting to load user data...");
    isLoadingRef.current = true;
    
    try {
      const userData = await apiClient.request("/api/user");
      console.log("User data loaded successfully:", userData);
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
        console.log("Authentication failed (401), removing token");
        removeToken();
      }

      // Handle terms-specific errors
      if (error.response?.status === 403 && error.response?.data?.requiresTerms) {
        router.push("/terms");
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [router, isNewLogin]);

  const acceptTerms = useCallback(async () => {
    try {
      await apiClient.request("/auth/accept-terms", {
        method: "POST",
      });
      await loadUser();
      router.push("/");
      toast.success("Terms accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept terms. Please try again.");
    }
  }, [router, loadUser]);

  const login = useCallback(() => {
    console.log("Starting login process...");
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
      
      const usageData = await apiClient.request("/api/usage", { method: "GET" });
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
  }, [user, loadUser]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiClient.request("/auth/logout", { method: "GET" });
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
  }, [router]);

  // Load user on initial render if token exists
  useEffect(() => {
    console.log("Initial auth check...");
    // Attempt to load user if there's a token
    if (getToken()) {
      console.log("Token found, loading user");
      loadUser();
    } else {
      console.log("No token found, setting loading to false");
      setLoading(false);
    }
  }, [loadUser]);

  // Handle OAuth message events
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Message received:", event.data);
      
      if (event.data.type === "LOGIN_SUCCESS") {
        console.log("Login success message received!");
        
        // Store the JWT token
        if (event.data.token) {
          saveToken(event.data.token);
          console.log("JWT token received and saved");
          
          setIsNewLogin(true);
          loadUser();
          
          if (event.data.requiresTerms) {
            router.push("/terms");
          }
        } else {
          console.error("No token received in login success message");
          toast.error("Authentication error: No token received");
        }
      } else if (event.data.type === "LOGIN_ERROR") {
        console.error("Login error:", event.data.message);
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
