"use client";

import {
  VStack,
  Box,
  Text,
  Button,
  Divider,
  IconButton,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiShield,
  FiBell,
  FiLogOut,
  FiChevronLeft,
} from "react-icons/fi";

interface SettingsSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  zIndex?: number;
}

const SettingsSidebar = ({
  activeTab = "profile",
  onTabChange,
  onLogout,
  zIndex,
}: SettingsSidebarProps) => {
  const router = useRouter();

  const sidebarBg = useColorModeValue("white", "gray.800");
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const activeTabBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      w="240px"
      borderRight="1px solid"
      borderColor={sidebarBorder}
      bg={sidebarBg}
      p={4}
      position="relative"
      zIndex={zIndex}
    >
      <Flex align="center" mb={6}>
        <IconButton
          icon={<FiChevronLeft />}
          size="sm"
          aria-label="Back"
          variant="ghost"
          onClick={() => router.back()}
          _hover={{ bg: hoverBg }}
        />
        <Text
          fontSize="xl"
          fontWeight="semibold"
          px={2}
          color={textColor}
        >
          User Settings
        </Text>
      </Flex>

      <VStack align="stretch" spacing={1}>
        <Button
          variant={activeTab === "profile" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiUser />}
          onClick={() => onTabChange?.("profile")}
          bg={activeTab === "profile" ? activeTabBg : "transparent"}
          _hover={{ bg: hoverBg }}
          color={textColor}
        >
          My Account
        </Button>
        <Button
          variant={activeTab === "privacy" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiShield />}
          onClick={() => onTabChange?.("privacy")}
          bg={activeTab === "privacy" ? activeTabBg : "transparent"}
          _hover={{ bg: hoverBg }}
          color={textColor}
        >
          Privacy
        </Button>
        <Button
          variant={activeTab === "notifications" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiBell />}
          onClick={() => onTabChange?.("notifications")}
          bg={activeTab === "notifications" ? activeTabBg : "transparent"}
          _hover={{ bg: hoverBg }}
          color={textColor}
        >
          Notifications
        </Button>
        <Divider borderColor={dividerColor} my={2} />
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<FiLogOut />}
          colorScheme="red"
          onClick={() => onLogout?.()}
        >
          Log Out
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsSidebar;
