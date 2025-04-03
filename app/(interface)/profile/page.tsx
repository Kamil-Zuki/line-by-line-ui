"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useBreakpointValue } from "@chakra-ui/react";
import SettingsLayout from "@/app/components/settings/SettingsLayout";
import AccountProfile from "@/app/components/settings/AccountProfile";
import DangerZone from "@/app/components/settings/DangerZone";
import PrivacySettings from "@/app/components/settings/PrivacySettings";
import NotificationSettings from "@/app/components/settings/NotificationSettings";
import { useToast } from "@chakra-ui/react";

const SettingsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    toast({
      title: "Account deletion requested",
      description: "This feature is not yet implemented",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
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
          <DangerZone onDeleteAccount={handleDeleteAccount} />
        </>
      )}
      {activeTab === "privacy" && <PrivacySettings />}
      {activeTab === "notifications" && <NotificationSettings />}
    </SettingsLayout>
  );
};

export default SettingsPage;
