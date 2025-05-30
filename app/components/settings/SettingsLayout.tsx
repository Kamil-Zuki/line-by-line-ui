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
}: SettingsLayoutProps) => {
  return (
    <Flex
      minH="100vh"
      bg="gray.800"
      color="white"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background:
          "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
        opacity: 0.3,
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
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
