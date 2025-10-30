"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useBreakpointValue, Box, VStack, Text as ChakraText, Button, useToast } from "@chakra-ui/react";
import SettingsLayout from "@/app/components/settings/SettingsLayout";
import AccountProfile from "@/app/components/settings/AccountProfile";
import DangerZone from "@/app/components/settings/DangerZone";
import PrivacySettings from "@/app/components/settings/PrivacySettings";
import NotificationSettings from "@/app/components/settings/NotificationSettings";
import AppearanceSettings from "@/app/components/settings/AppearanceSettings";

const SettingsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast(); // Use the useToast hook directly

  const showToast = (title: string, description: string, status: "info" | "warning") => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }: { onClose: () => void }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <ChakraText fontWeight="bold" fontSize="md">{title}</ChakraText>
            {description && <ChakraText fontSize="sm">{description}</ChakraText>}
          </VStack>
          <Button size="sm" onClick={onClose} color="white" variant="ghost">
            Close
          </Button>
        </Box>
      ),
    });
  };

  const handleLogout = () => {
    logout();
    showToast("Logged Out Successfully", "", "info");
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    showToast("Account Deletion Requested", "This feature is not yet implemented", "warning");
  };

  if (!user) {
    return null;
  }

  return (
    <SettingsLayout
      isMobile={isMobile ?? false}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "profile" && (
        <>
          <AccountProfile user={user} />
          <AppearanceSettings />
          <DangerZone onDeleteAccount={handleDeleteAccount} />
        </>
      )}
      {activeTab === "privacy" && <PrivacySettings />}
      {activeTab === "notifications" && <NotificationSettings />}
    </SettingsLayout>
  );
};

export default SettingsPage;