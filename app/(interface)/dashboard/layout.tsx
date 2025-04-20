"use client";

import SideBar from "@/app/components/SideBar";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaHome, FaLayerGroup } from "react-icons/fa";

const sidebarButtons = [
  { icon: FaHome, path: "/dashboard", labelText: "Dashboard" },
  { icon: FaLayerGroup, path: "/dashboard/decks", labelText: "Decks" },
  // Add more button data here
];
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <SideBar buttonData={sidebarButtons}/>
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
