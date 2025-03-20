"use client";

import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import SideBar from "@/app/components/SideBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex minH="100vh">
      <SideBar />
      <Box flex="1" p={6}>
        {children}
      </Box>
    </Flex>
  );
}
