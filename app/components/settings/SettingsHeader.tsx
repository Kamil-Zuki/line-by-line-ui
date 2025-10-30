"use client";

import { HStack, Text, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

/**
 * Settings Header - Client Component
 * Handles navigation and responsive styling
 */
const SettingsHeader = () => {
  const router = useRouter();
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <HStack mb={6} spacing={4}>
      <IconButton
        icon={<FiChevronLeft />}
        aria-label="Back"
        variant="ghost"
        onClick={() => router.back()}
      />
      <Text fontSize="xl" fontWeight="semibold" color={textColor}>
        User Settings
      </Text>
    </HStack>
  );
};

export default SettingsHeader;