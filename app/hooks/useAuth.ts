"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tokens {
  accessToken: string; // Placeholder, not stored client-side
  refreshToken?: string;
}

interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  avatarUrl: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Tokens>({
    accessToken: "",
    refreshToken: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const getCookie = (name: string): string | undefined =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const userData: User = await res.json();
          const refreshToken = getCookie("refreshToken");
          setTokens({ accessToken: "", refreshToken });
          setUser(userData);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Access token invalid or expired, attempting refresh");
          const refreshed = await refreshToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setUser(null);
            // Middleware will redirect, no need to push here
          }
        } else {
          console.log(`Unexpected status from /api/auth/me: ${res.status}`);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

      const { refreshToken } = await res.json();
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ accessToken: "", refreshToken });
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) {
        setUser(await meRes.json());
        setIsAuthenticated(true);
      }
      console.log("Login successful, refreshToken set:", refreshToken);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { message } = await res.json();

      return message;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsAuthenticated(false);
    setTokens({ accessToken: "", refreshToken: "" });
    setUser(null);
    console.log("Logged out, tokens cleared");
    router.push("/login");
  };

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

      const { refreshToken: newRefreshToken } = await res.json();
      document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ accessToken: "", refreshToken: newRefreshToken });
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) {
        setUser(await meRes.json());
        setIsAuthenticated(true);
      }
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

  return {
    isAuthenticated,
    tokens,
    user,
    login,
    logout,
    refreshToken,
    register,
    loading,
  };
}
