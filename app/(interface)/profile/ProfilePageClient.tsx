"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { Spinner, Flex } from "@chakra-ui/react";
import AccountProfile from "@/app/components/settings/AccountProfile";
import AppearanceSettings from "@/app/components/settings/AppearanceSettings";
import PrivacySettings from "@/app/components/settings/PrivacySettings";
import NotificationSettings from "@/app/components/settings/NotificationSettings";
import ProfileActions from "@/app/components/settings/ProfileActions";
import LogoutHandler from "@/app/components/settings/LogoutHandler";
import MobileDetector from "@/app/components/settings/MobileDetector";

/**
 * Client wrapper for profile page
 * Handles authentication state and user-dependent rendering
 */
export default function ProfilePageClient() {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" thickness="4px" color="brand.500" />
      </Flex>
    );
  }

  // Not authenticated - redirect handled by middleware
  if (!user) {
    return null;
  }

  return (
    <MobileDetector>
      {(isMobile) => (
        <LogoutHandler isMobile={isMobile}>
          {(activeTab) => (
            <>
              {activeTab === "profile" && (
                <>
                  <AccountProfile user={user} />
                  <AppearanceSettings />
                  <ProfileActions />
                </>
              )}
              {activeTab === "privacy" && <PrivacySettings />}
              {activeTab === "notifications" && <NotificationSettings />}
            </>
          )}
        </LogoutHandler>
      )}
    </MobileDetector>
  );
}

