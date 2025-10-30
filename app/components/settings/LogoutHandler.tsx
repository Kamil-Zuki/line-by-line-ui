"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import SettingsTabManager from "./SettingsTabManager";
import { ReactNode } from "react";

interface LogoutHandlerProps {
  children: (activeTab: string) => ReactNode;
  isMobile: boolean;
}

/**
 * Client component that handles logout logic
 * Wraps authentication-dependent functionality
 */
export default function LogoutHandler({ children, isMobile }: LogoutHandlerProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out Successfully",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    router.push("/login");
  };

  return (
    <SettingsTabManager onLogout={handleLogout} isMobile={isMobile}>
      {children}
    </SettingsTabManager>
  );
}

