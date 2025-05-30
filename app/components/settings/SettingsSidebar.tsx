"use client";

import {
  VStack,
  Box,
  Text,
  Button,
  Divider,
  IconButton,
  Flex,
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
  zIndex?: number; // Add zIndex prop
}

const SettingsSidebar = ({
  activeTab = "profile",
  onTabChange,
  onLogout,
  zIndex,
}: SettingsSidebarProps) => {
  const router = useRouter();

  return (
    <Box
      w="240px"
      borderRight="2px solid"
      borderColor="blue.900"
      bg="gray.800"
      p={4}
      position="relative"
      zIndex={zIndex} // Apply zIndex to ensure clickability
    >
      <Flex>
        <IconButton
          icon={<FiChevronLeft color="white" />}
          height={7}
          width={1}
          aria-label="Back"
          variant="ghost"
          onClick={() => router.back()}
          color="white"
          _hover={{ bg: "gray.700" }}
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={6}
          px={2}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
        >
          User Settings
        </Text>
      </Flex>

      <VStack align="stretch" spacing={1}>
        <Button
          variant={activeTab === "profile" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiUser color="white" />}
          onClick={() => onTabChange?.("profile")}
          bg={activeTab === "profile" ? "gray.700" : "transparent"}
          _hover={{ bg: "gray.600" }}
          color="white"
          border={activeTab === "profile" ? "2px solid" : "none"}
          borderColor="blue.900"
        >
          My Account
        </Button>
        <Button
          variant={activeTab === "privacy" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiShield color="white" />}
          onClick={() => onTabChange?.("privacy")}
          bg={activeTab === "privacy" ? "gray.700" : "transparent"}
          _hover={{ bg: "gray.600" }}
          color="white"
          border={activeTab === "privacy" ? "2px solid" : "none"}
          borderColor="blue.900"
        >
          Privacy
        </Button>
        <Button
          variant={activeTab === "notifications" ? "solid" : "ghost"}
          justifyContent="flex-start"
          leftIcon={<FiBell color="white" />}
          onClick={() => onTabChange?.("notifications")}
          bg={activeTab === "notifications" ? "gray.700" : "transparent"}
          _hover={{ bg: "gray.600" }}
          color="white"
          border={activeTab === "notifications" ? "2px solid" : "none"}
          borderColor="blue.900"
        >
          Notifications
        </Button>
        <Divider borderColor="gray.600" my={2} />
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<FiLogOut color="white" />}
          color="white"
          bg="red.800"
          border="2px solid"
          borderColor="blue.900"
          _hover={{
            bg: "red.700",
            boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
            transform: "scale(1.02)",
          }}
          _active={{ bg: "red.900" }}
          transition="all 0.2s"
          onClick={() => onLogout?.()}
        >
          Log Out
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsSidebar;
