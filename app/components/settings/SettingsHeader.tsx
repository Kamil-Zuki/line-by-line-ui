"use client";

import { HStack, Text, IconButton } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

const SettingsHeader = () => {
  const router = useRouter();

  return (
    <HStack mb={6} spacing={4}>
      <IconButton
        icon={<FiChevronLeft color="white" />}
        aria-label="Back"
        variant="ghost"
        onClick={() => router.back()}
        color="white"
      />
      <Text fontSize="xl" fontWeight="bold" color="white">
        User Settings
      </Text>
    </HStack>
  );
};

export default SettingsHeader;