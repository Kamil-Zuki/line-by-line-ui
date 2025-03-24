"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Tokens>({ accessToken: "", refreshToken: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const getCookie = (name: string): string | undefined =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getCookie("accessToken");
      console.log("Initial cookies:", document.cookie);
      console.log("Checking auth, accessToken:", accessToken || "none");

      if (!accessToken) {
        console.log("No accessToken found, unauthenticated");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          console.log("User from /me:", user);
          const refreshToken = getCookie("refreshToken");
          setTokens({ accessToken, refreshToken });
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Access token expired, attempting refresh");
          const refreshed = await refreshToken();
          if (!refreshed) {
            setIsAuthenticated(false);
          }
        } else {
          console.log(`Fetch /api/auth/me failed with status: ${res.status}`);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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

      const { accessToken, refreshToken } = await res.json();
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      setTokens({ accessToken, refreshToken });
      setIsAuthenticated(true);
      console.log("Login successful, tokens set:", { accessToken, refreshToken });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsAuthenticated(false);
    setTokens({ accessToken: "", refreshToken: "" });
    console.log("Logged out, tokens cleared");
    router.push("/login");
  };

  const refreshToken = async (): Promise<boolean> => {
    const refresh = getCookie("refreshToken");
    if (!refresh) {
      console.log("No refresh token available, logging out");
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

      const { accessToken } = await res.json();
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}`;
      setTokens((prev) => ({ ...prev, accessToken }));
      setIsAuthenticated(true);
      console.log("Token refreshed successfully:", accessToken);
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