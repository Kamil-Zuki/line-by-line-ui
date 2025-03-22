"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export function useAuth() {
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch("/api/auth/login", { credentials: "include" });
        if (res.ok) {
          const { accessToken, refreshToken } = await res.json();
          setTokens({ accessToken, refreshToken });
        }
      } catch {
        // Middleware will redirect if tokens are invalid
      }
    };
    fetchTokens();
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
      await login(email, password); // Auto-login after registration
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
    if (!tokens.refreshToken) {
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
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Token refresh failed");

      const { accessToken, refreshToken: newRefreshToken } = await res.json();
      setTokens({ accessToken, refreshToken: newRefreshToken });
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
    loading,
    login,
    logout,
    refreshToken,
    register,
    isAuthenticated: !!tokens.accessToken,
  };
}
