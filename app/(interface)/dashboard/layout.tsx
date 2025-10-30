"use client";

import SideBar from "@/app/components/sideBar";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaCog, FaHome, FaLayerGroup, FaStickyNote } from "react-icons/fa";

const sidebarButtons = [
  { icon: FaHome, path: "/dashboard", labelText: "Community decks" },
  { icon: FaLayerGroup, path: "/dashboard/decks", labelText: "My Decks" },
  { icon: FaStickyNote, path: "/dashboard/cards", labelText: "Cards" },
  { icon: FaCog, path: "/dashboard/settings", labelText: "Settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex minH="100vh" bg={bgColor}>
      <SideBar buttonData={sidebarButtons} />
      <Box
        flex="1"
        p={{ base: 4, md: 8 }}
        ml={{ base: 0, md: "250px" }}
      >
        {children}
      </Box>
    </Flex>
  );
}
