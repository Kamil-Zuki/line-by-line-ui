"use client";

import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import SettingsSidebar from "./SettingsSidebar";
import SettingsHeader from "./SettingsHeader";

interface SettingsLayoutProps {
  children: ReactNode;
  isMobile: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
}

const SettingsLayout = ({
  children,
  isMobile,
  activeTab,
  onTabChange,
  onLogout,
}: SettingsLayoutProps) => (
  <Flex minH="100vh" bg="#313338" color="white">
    {!isMobile && (
      <SettingsSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
      />
    )}
    <Box flex={1} px={{ base: 4, md: 8, lg: 12 }} py={6}>
      {isMobile && <SettingsHeader />}
      <Box maxW="800px" mx="auto">
        {children}
      </Box>
    </Box>
  </Flex>
);

export default SettingsLayout;
