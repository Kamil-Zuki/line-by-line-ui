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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    setTokens({ accessToken, refreshToken });
    setLoading(false);
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
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      setTokens({ accessToken, refreshToken: refreshToken || null });
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
      });

      if (!res.ok) {
        throw new Error("Token refresh failed");
      }

      const { accessToken, refreshToken: newRefreshToken } = await res.json();
      localStorage.setItem("accessToken", accessToken);
      if (newRefreshToken)
        localStorage.setItem("refreshToken", newRefreshToken);
      setTokens({ accessToken, refreshToken: newRefreshToken || null });
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
    isAuthenticated: !!tokens.accessToken,
  };
}
