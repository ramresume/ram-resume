import { useState, useCallback } from "react";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SERVER_URL?.replace("https://", "http://")
    : process.env.NEXT_PUBLIC_SERVER_URL;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = { ...options.headers };
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
        ...(process.env.NODE_ENV === "development" && {
          rejectUnauthorized: false,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorData;

        if (contentType?.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = { error: await response.text() };
        }

        if (response.status === 403) {
          if (errorData.requiresTerms) {
            throw {
              response: {
                status: 403,
                data: { requiresTerms: true, error: "Terms acceptance required" },
              },
            };
          }
          if (errorData.error === "Weekly usage limit reached") {
            throw {
              response: {
                status: 403,
                data: {
                  error: "Weekly usage limit reached",
                  resetDate: errorData.resetDate,
                  remainingUses: errorData.remainingUses,
                },
              },
            };
          }
        }

        if (response.status === 401) {
          throw {
            response: {
              status: 401,
              data: { error: "Please log in to access this resource" },
            },
          };
        }

        throw new Error(errorData.error || "API request failed");
      }

      if (options.responseType === "blob") {
        return await response.blob();
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
