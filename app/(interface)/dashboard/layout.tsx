"use client";

import SideBar from "@/app/components/SideBar";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaHome, FaLayerGroup, FaStickyNote } from "react-icons/fa";

const sidebarButtons = [
  { icon: FaHome, path: "/dashboard", labelText: "Dashboard" },
  { icon: FaLayerGroup, path: "/dashboard/decks", labelText: "Decks" },
  { icon: FaStickyNote, path: "/dashboard/cards", labelText: "Cards" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      minH="100vh"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
        opacity: 0.3,
        zIndex: 0,
      }}
    >
      <SideBar buttonData={sidebarButtons} />
      <Box
        flex="1"
        p={{ base: 4, md: 6 }}
        ml={{ base: 0, md: "257px" }}
        bg="gray.800"
        border="2px solid"
        borderColor="blue.900"
        borderRadius={{ md: "md" }}
        boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
        position="relative"
        zIndex={1}
        _after={{
          content: '""',
          position: "absolute",
          top: "-2px",
          left: "10%",
          width: "60px",
          height: "2px",
          bg: "white",
          boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
          zIndex: 2,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}