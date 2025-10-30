"use client";

import { useRouter } from "next/navigation";
import { useToast, Box, VStack, Text, Button } from "@chakra-ui/react";
import DangerZone from "./DangerZone";

/**
 * Client component for interactive profile actions
 * Handles logout and account deletion with toast notifications
 */
export default function ProfileActions() {
  const router = useRouter();
  const toast = useToast();

  const showToast = (
    title: string,
    description: string,
    status: "info" | "warning"
  ) => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      title,
      description,
      status,
    });
  };

  const handleDeleteAccount = () => {
    showToast(
      "Account Deletion Requested",
      "This feature is not yet implemented",
      "warning"
    );
  };

  return <DangerZone onDeleteAccount={handleDeleteAccount} />;
}

