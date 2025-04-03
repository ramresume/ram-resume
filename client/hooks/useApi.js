import { useState, useCallback } from "react";

// Create a helper to get the token directly
const getTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get auth context if available, but don't fail if not
  let authToken = null;
  try {
    // Dynamic import to avoid circular dependency during SSR
    if (typeof window !== "undefined") {
      const { useAuth } = require("../context/AuthContext");
      const auth = useAuth();
      if (auth && auth.getToken) {
        authToken = auth.getToken();
      }
    }
  } catch (e) {
    console.log("Auth context not available, using fallback");
    authToken = getTokenFromStorage();
  }

  const request = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);

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

        // Get the token from storage as a fallback
        const token = authToken || getTokenFromStorage();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          
          if (!response.ok) {
            throw { 
              response: {
                status: response.status,
                data
              },
              message: data.error || `Request failed with status ${response.status}`
            };
          }
          
          return data;
        } else {
          if (!response.ok) {
            throw { 
              response: {
                status: response.status
              },
              message: `Request failed with status ${response.status}`
            };
          }
          
          return await response.text();
        }
      } catch (error) {
        console.error("API request error:", error);
        setError(error.response?.data?.error || error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [authToken]
  );

  return { request, loading, error };
};
