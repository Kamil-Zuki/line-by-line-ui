"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [tokens, setTokens] = useState<Tokens>({
    accessToken: "",
    refreshToken: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          console.log("User from /me:", user);
          const refreshToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("refreshToken="))
            ?.split("=")[1];
          setTokens({ accessToken, refreshToken });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const { accessToken, refreshToken } = await res.json();
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${
        60 * 60 * 24
      }`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;
      setTokens({ accessToken, refreshToken });
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, confirmPassword }), // Adjust fields
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }

      const { accessToken, refreshToken } = await res.json();
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${
        60 * 60 * 24
      }`;
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
          60 * 60 * 24 * 30
        }`;
      }
      setTokens({ accessToken, refreshToken });
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error: any) {
      throw error; // Let the page handle the error
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsAuthenticated(false);
    setTokens({ accessToken: "", refreshToken: "" });
    router.push("/login");
  };

  const refreshToken = async () => {
    const refresh = tokens.refreshToken;
    if (!refresh) {
      logout();
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (res.ok) {
        const { accessToken } = await res.json();
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${
          60 * 60 * 24
        }`;
        setTokens((prev) => ({ ...prev, accessToken }));
        setIsAuthenticated(true);
        return true;
      }
      logout();
      return false;
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
    login,
    register,
    logout,
    refreshToken,
    loading,
  };
}
