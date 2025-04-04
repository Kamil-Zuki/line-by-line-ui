"use client";

import SideBar from "@/app/components/sideBar";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <SideBar />
      <Box
        flex="1"
        p={{ base: 4, md: 6 }}
        ml={{ base: 0, md: "250px" }}
        bg="white"
        borderRadius={{ md: "md" }}
        boxShadow={{ md: "sm" }}
      >
        {children}
      </Box>
    </Flex>
  );
}
