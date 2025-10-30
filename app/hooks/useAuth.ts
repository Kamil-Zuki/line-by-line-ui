"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Tokens {
  refreshToken?: string;
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
  const pathname = usePathname();

  const getCookie = (name: string): string | undefined => {
    const cookieString = document.cookie;
    if (!cookieString) return undefined;

    const cookies = cookieString.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    if (!cookie) return undefined;

    const value = cookie.substring(name.length + 1);
    console.log(`Cookie ${name}:`, value); // Debug log
    return value;
  };

  useEffect(() => {
    const publicRoutes = new Set(["/login", "/register"]);
    if (publicRoutes.has(pathname || "")) {
      // Skip auth check on public routes
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      console.log("Starting checkAuth");
      setLoading(true);
      try {
        console.log("Fetching /api/auth/me");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        const res = await fetch("/api/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("/api/auth/me response status:", res.status);

        if (res.ok) {
          const userData: User = await res.json();
          console.log("User data:", userData);
          const refreshToken = getCookie("refreshToken");
          setTokens({ refreshToken });
          setUser(userData);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          console.log("Access token invalid or expired, attempting refresh");
          const refreshed = await refreshToken();
          if (!refreshed) {
            console.log("Refresh failed, setting unauthenticated state");
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log(`Unexpected status from /api/auth/me: ${res.status}`);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error: any) {
        console.error("Error in checkAuth:", error.message);
        if (error.name === "AbortError") {
          console.error("Request to /api/auth/me timed out");
        }
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        console.log("Setting loading to false in checkAuth");
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const refreshToken = async (): Promise<boolean> => {
    const refresh = tokens.refreshToken || getCookie("refreshToken");
    if (!refresh) {
      console.log("No refresh token available, cannot refresh");
      // Do not force logout here; let caller handle unauthenticated state
      return false;
    }

    console.log("Refreshing token with refreshToken:", refresh);
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("/api/auth/refresh-token response status:", res.status);

      if (!res.ok) {
        console.log(`Refresh failed with status: ${res.status}`);
        return false;
      }

      const { refreshToken: newRefreshToken } = await res.json();
      console.log("New refresh token:", newRefreshToken);
      document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
      setTokens({ refreshToken: newRefreshToken });

      console.log("Fetching /api/auth/me after refresh");
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
        signal: new AbortController().signal,
      });

      console.log("/api/auth/me after refresh status:", meRes.status);
      if (meRes.ok) {
        const userData = await meRes.json();
        console.log("User data after refresh:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      }
      return true;
    } catch (error: any) {
      console.error("Refresh token failed:", error.message);
      if (error.name === "AbortError") {
        console.error("Request to /api/auth/refresh-token timed out");
      }
      return false;
    } finally {
      console.log("Setting loading to false in refreshToken");
      setLoading(false);
    }
  };

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
        return {
          success: false,
          error: errorData.message || "Invalid credentials",
        };
      }

      const { refreshToken } = await res.json();
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; sameSite=lax`;
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
        credentials: "include",
      });

      if (!res.ok) {
        const raw = await res.text();
        let errorMessage = "Registration failed";
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            errorMessage = parsed.message || raw;
          } catch {
            errorMessage = raw;
          }
        } else {
          errorMessage = `Registration failed (status ${res.status})`;
        }
        return { success: false, error: errorMessage };
      }

      const okRaw = await res.text();
      let successMessage = "Registration successful";
      if (okRaw) {
        try {
          const parsedOk = JSON.parse(okRaw);
          successMessage = parsedOk.message || successMessage;
        } catch {
          successMessage = okRaw || successMessage;
        }
      }
      return { success: true, message: successMessage };
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      console.log("Tokens", tokens);

      // Even if the server returns 401/403 (already logged out/expired), proceed to clear client state
      if (!res.ok && res.status >= 500) {
        console.log("Logout backend error status:", res.status);
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear client state and navigate away
      setIsAuthenticated(false);
      setTokens({ refreshToken: "" });
      setUser(null);
      document.cookie = "refreshToken=; path=/; max-age=0; sameSite=lax";
      router.push("/login");
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
    tokens,
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
