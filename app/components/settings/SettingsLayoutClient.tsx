"use client";

import { ReactNode } from "react";
import { Flex, Box, useColorModeValue } from "@chakra-ui/react";

interface SettingsLayoutClientProps {
  children: ReactNode;
  sidebar: ReactNode;
  isMobile: boolean;
}

/**
 * Client wrapper for settings layout that handles color mode
 * Separates client-side color logic from server rendering
 */
export default function SettingsLayoutClient({
  children,
  sidebar,
  isMobile,
}: SettingsLayoutClientProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex minH="100vh" bg={bgColor} position="relative">
      {!isMobile && sidebar}
      <Box
        flex={1}
        px={{ base: 4, md: 8, lg: 12 }}
        py={6}
        position="relative"
        zIndex={3}
      >
        <Box maxW="800px" mx="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

