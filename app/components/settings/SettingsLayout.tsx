"use client";

import { ReactNode } from "react";
import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
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
}: SettingsLayoutProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex
      minH="100vh"
      bg={bgColor}
      position="relative"
    >
      {!isMobile && (
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
          zIndex={3} // Ensure sidebar is above pseudo-elements
        />
      )}
      <Box
        flex={1}
        px={{ base: 4, md: 8, lg: 12 }}
        py={6}
        position="relative"
        zIndex={3}
      >
        {isMobile && <SettingsHeader />}
        <Box maxW="800px" mx="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default SettingsLayout;
