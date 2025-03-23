"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
}

export function useAuth() {
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
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
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Invalid credentials");
      }

      const { accessToken, refreshToken } = await res.json();
      setTokens({ accessToken, refreshToken });
      setIsAuthenticated(true);
      // Fetch user info after login
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) setUser(await meRes.json());
      
      toast({
        title: "Logged in!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Registration failed");
      }

      toast({
        title: "Registered successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await login(email, password); // Auto-login
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setTokens({ accessToken: null, refreshToken: null });
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refreshTokenValue = tokens.refreshToken;
    if (!refreshTokenValue) {
      toast({
        title: "No refresh token",
        description: "Please log in again",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      logout();
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Token refresh failed");

      const { accessToken, refreshToken: newRefreshToken } = await res.json();
      setTokens({ accessToken, refreshToken: newRefreshToken });
      setIsAuthenticated(true);
      // Refresh user info
      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (meRes.ok) setUser(await meRes.json());
      return true;
    } catch (error: any) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tokens,
    user,
    loading,
    login,
    logout,
    refreshToken,
    register,
    isAuthenticated,
  };
}