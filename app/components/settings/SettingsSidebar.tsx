"use client";

import { VStack, Box, Text, Button, Divider } from "@chakra-ui/react";
import { FiUser, FiShield, FiBell, FiLogOut } from "react-icons/fi";

interface SettingsSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
}

const SettingsSidebar = ({
  activeTab = "profile",
  onTabChange,
  onLogout,
}: SettingsSidebarProps) => (
  <Box
    w="240px"
    borderRight="1px solid"
    borderColor="whiteAlpha.100"
    bg="#2b2d31"
    p={4}
  >
    <Text fontSize="xl" fontWeight="bold" mb={6} px={2} color="white">
      User Settings
    </Text>

    <VStack align="stretch" spacing={1}>
      <Button
        variant={activeTab === "profile" ? "solid" : "ghost"}
        justifyContent="flex-start"
        leftIcon={<FiUser color="white" />}
        onClick={() => onTabChange?.("profile")}
        bg={activeTab === "profile" ? "#404249" : "transparent"}
        _hover={{ bg: "#404249" }}
        color="white"
      >
        My Account
      </Button>
      <Button
        variant={activeTab === "privacy" ? "solid" : "ghost"}
        justifyContent="flex-start"
        leftIcon={<FiShield color="white" />}
        onClick={() => onTabChange?.("privacy")}
        bg={activeTab === "privacy" ? "#404249" : "transparent"}
        _hover={{ bg: "#404249" }}
        color="white"
      >
        Privacy
      </Button>
      <Button
        variant={activeTab === "notifications" ? "solid" : "ghost"}
        justifyContent="flex-start"
        leftIcon={<FiBell color="white" />}
        onClick={() => onTabChange?.("notifications")}
        bg={activeTab === "notifications" ? "#404249" : "transparent"}
        _hover={{ bg: "#404249" }}
        color="white"
      >
        Notifications
      </Button>
      <Divider borderColor="whiteAlpha.100" my={2} />
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FiLogOut color="red.300" />}
        color="red.300"
        onClick={() => onLogout?.()}
        _hover={{ bg: "red.900" }}
      >
        Log Out
      </Button>
    </VStack>
  </Box>
);

export default SettingsSidebar;
