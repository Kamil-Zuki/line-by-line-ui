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
        _hover={{ bg: "gray.700" }}
      />
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="white"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
      >
        User Settings
      </Text>
    </HStack>
  );
};

export default SettingsHeader;