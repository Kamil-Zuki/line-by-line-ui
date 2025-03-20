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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Load tokens from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    setTokens({ accessToken, refreshToken });
    setLoading(false);
  }, []);

  // Login function
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
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
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

  // Register function
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

      const { message } = await res.json();
      toast({
        title: "Registration successful",
        description: message || "Please confirm your email",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/auth/login");
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

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setTokens({ accessToken: null, refreshToken: null });
    toast({
      title: "Logged out",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.push("/auth/login");
  };

  // Refresh token function
  const refreshToken = async () => {
    if (!tokens.refreshToken) return false;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!res.ok) {
        throw new Error("Token refresh failed");
      }

      const { accessToken, refreshToken: newRefreshToken } = await res.json();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
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
    register,
    logout,
    refreshToken,
    isAuthenticated: !!tokens.accessToken,
  };
}
