"use client";

import SideBar from "@/app/components/SideBar";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaHome, FaLayerGroup } from "react-icons/fa";

const sidebarButtons = [
  { icon: FaHome, path: "/dashboard", labelText: "Dashboard" },
  { icon: FaLayerGroup, path: "/dashboard/decks", labelText: "Decks" },
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
        background: "radial-gradient(circle at 5% 5%, transparent 0%, transparent 5%, white 6%, transparent 7%)",
        backgroundSize: "30px 30px",
        opacity: 0.05,
        zIndex: 0,
      }}
    >
      <SideBar buttonData={sidebarButtons} />
      <Box
        flex="1"
        p={{ base: 4, md: 6 }}
        ml={{ base: 0, md: "257px" }}
        bg="black"
        border="2px solid"
        borderColor="red.500"
        borderRadius={{ md: "md" }}
        boxShadow="0 0 15px rgba(59, 130, 246, 0.5)" // Blue glow for Spidey
        position="relative"
        zIndex={1}
        _after={{
          content: '""',
          position: "absolute",
          top: "-5px",
          left: "10%",
          width: "100px",
          height: "2px",
          bg: "white",
          transform: "rotate(-45deg)",
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
          zIndex: 2,
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}