"use client";

import { Box } from "@chakra-ui/react";
import Header from "../components/Header"; // Adjusted case to match convention
import SideBar from "../components/SideBar"; // Adjusted case to match convention
import Breadcrumbs from "../components/Breadcrumbs";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Box display={{ base: "block", md: "flex" }}>
        <SideBar />
        <Box flex="1" ml={{ base: 0, md: "250px" }} p={4}>
          <Breadcrumbs />
          <Box as="main" mt={4}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
