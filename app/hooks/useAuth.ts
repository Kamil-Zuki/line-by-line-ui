"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tokens {
  refreshToken?: string; // Only refresh token is stored client-side
}

interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  avatarUrl: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Tokens>({ refreshToken: "" });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const getCookie = (name: string): string | undefined => {
    // Get the full cookie string
    const cookieString = document.cookie;
    if (!cookieString) return undefined;

    // Split into individual cookie entries
    const cookies = cookieString.split("; ");

    // Find the cookie with the matching name
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    if (!cookie) return undefined;

    // Extract the value after the first '='
    const value = cookie.substring(name.length + 1); // +1 for the '='

    return value;
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" }); // Access token is HttpOnly
        if (res.ok) {
          const userData: User = await res.json();
          const refreshToken = getCookie("refreshToken"); // Refresh token is not HttpOnly
          setTokens({ refreshToken });
          setUser(userData);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Access token invalid or expired, attempting refresh");
          const refreshed = await refreshToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setUser(null);
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
        credentials: "include", // Server sets HttpOnly access token
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message || "Invalid credentials",
        };
      }

      const { refreshToken } = await res.json(); // Server returns refresh token
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`; // Store refresh token client-side
      setTokens({ refreshToken });

      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) {
        setUser(await meRes.json());
        setIsAuthenticated(true);
      }
      router.push("/dashboard");
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ email, password, confirmPassword }),
        credentials: "include", // Server might set access token
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message || "Registration failed",
        };
      }

      const { message } = await res.json();
      return { success: true, message };
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Server invalidates HttpOnly access token
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }), // Send refresh token if needed
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      setIsAuthenticated(false);
      setTokens({ refreshToken: "" });
      setUser(null);
      document.cookie = "refreshToken=; path=/; max-age=0; sameSite=lax"; // Clear refresh token
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    const refresh = tokens.refreshToken || getCookie("refreshToken");
    if (!refresh) {
      console.log("No refresh token available, cannot refresh");
      logout();
      return false;
    }

    console.log("Refresh token method:", refresh);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
        credentials: "include", // Server sets new HttpOnly access token
      });

      if (!res.ok) {
        console.log(`Refresh failed with status: ${res.status}`);
        logout();
        return false;
      }

      const { refreshToken: newRefreshToken } = await res.json(); // Server returns new refresh token
      document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ refreshToken: newRefreshToken });

      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) {
        setUser(await meRes.json());
        setIsAuthenticated(true);
      }
      return true;
    } catch (error) {
      console.error("Refresh token failed:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message,
        };
      }

      const { message } = await res.json();
      return { success: true, message };
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  const updateUsername = async (username: string) => {
    try {
      const res = await fetch("/api/auth/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message,
        };
      }

      const { message } = await res.json();
      return { success: true, message };
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    isAuthenticated,
    tokens, // Only contains refreshToken
    user,
    login,
    logout,
    refreshToken,
    register,
    updatePassword,
    updateUsername,
    loading,
  };
}
