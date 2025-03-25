"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tokens {
  accessToken: string; // Placeholder, not stored client-side
  refreshToken?: string; // Stored client-side for refresh
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Tokens>({
    accessToken: "",
    refreshToken: "",
  });
  const [loading, setLoading] = useState<boolean>(true); // Start as true
  const router = useRouter();

  const getCookie = (name: string): string | undefined =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

  // Check authentication status on mount or route change
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      console.log(
        "checkAuth starting, client-visible cookies:",
        document.cookie
      );

      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Send httpOnly accessToken
        });

        if (res.ok) {
          const user = await res.json();
          console.log("User authenticated via /api/auth/me:", user);
          const refreshToken = getCookie("refreshToken");
          setTokens({ accessToken: "", refreshToken });
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Access token invalid or expired, attempting refresh");
          const refreshed = await refreshToken();
          if (!refreshed) {
            console.log("Refresh failed, user unauthenticated");
            setIsAuthenticated(false);
            router.push("/login");
          }
        } else {
          console.log(`Unexpected status from /api/auth/me: ${res.status}`);
          setIsAuthenticated(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        setIsAuthenticated(false);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { refreshToken } = await res.json(); // accessToken set as httpOnly by server
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ accessToken: "", refreshToken });
      setIsAuthenticated(true);
      console.log("Login successful, refreshToken set:", refreshToken);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsAuthenticated(false);
    setTokens({ accessToken: "", refreshToken: "" });
    console.log("Logged out, tokens cleared");
    router.push("/login");
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    const refresh = getCookie("refreshToken");
    if (!refresh) {
      console.log("No refresh token available, cannot refresh");
      logout();
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
        credentials: "include",
      });

      if (!res.ok) {
        console.log(`Refresh failed with status: ${res.status}`);
        logout();
        return false;
      }

      const { refreshToken: newRefreshToken } = await res.json(); // Server updates accessToken
      document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ accessToken: "", refreshToken: newRefreshToken });
      setIsAuthenticated(true);
      console.log(
        "Token refreshed successfully, new refreshToken:",
        newRefreshToken
      );
      return true;
    } catch (error) {
      console.error("Refresh token failed:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, tokens, login, logout, refreshToken, loading };
}
