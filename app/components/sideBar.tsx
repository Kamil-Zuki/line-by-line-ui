"use client";

import {
  Box,
  VStack,
  Text,
  Button,
  Divider,
  Icon,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaBars, FaCog, FaBook, FaHome, FaTimes } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import { IconType } from "react-icons";
import React from "react";
import Logo from "@/app/components/Logo";

interface SideBarButtonData {
  icon: IconType;
  path: string;
  labelText: string;
}

interface SideBarProps {
  buttonData?: SideBarButtonData[];
}

export default function SideBar({ buttonData }: SideBarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Default button data if not provided via props
  const defaultButtonData: SideBarButtonData[] = [
    {
      icon: FaHome,
      path: "/dashboard",
      labelText: "Dashboard",
    },
    {
      icon: FaBook,
      path: "/dashboard/decks",
      labelText: "Decks",
    },
    {
      icon: FaCog,
      path: "/dashboard/settings",
      labelText: "Settings",
    },
  ];

  const buttonsToRender = buttonData || defaultButtonData;

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const actions = [
    {
      label: "Open Profile",
      onClick: () => handleNavigation("/profile"),
      color: "gray.700",
    },
    { label: "Logout", onClick: () => logout(), color: "red.600" },
  ];

  const profileActions = isAuthenticated ? actions : [];

  return (
    <>
      {/* Mobile Toggle Button */}
      <IconButton
        aria-label="Open menu"
        icon={<FaBars />}
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex={20}
        colorScheme="brand"
        onClick={onOpen}
      />

      {/* Sidebar */}
      <Box
        as="nav"
        w={{ base: isOpen ? "250px" : "0", md: "250px" }}
        h="100vh"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        p={{ base: isOpen ? 4 : 0, md: 4 }}
        position="fixed"
        top={0}
        left={0}
        overflowX="hidden"
        overflowY="auto"
        transition="width 0.3s"
        zIndex={10}
        boxShadow="sm"
      >
        <VStack align="stretch" spacing={4}>
          {/* Logo/Title */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <IconButton
              aria-label="Close menu"
              icon={<FaTimes />}
              display={{ base: "flex", md: "none" }}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
            <Logo size={28} />
          </Box>

          {/* Profile Menu or Login Button */}
          {isAuthenticated && user ? (
            <ProfileMenu userName={user.userName} actions={profileActions} />
          ) : (
            <Button
              leftIcon={<Icon as={FaSignInAlt} />}
              variant="solid"
              justifyContent="start"
              w="full"
              colorScheme="brand"
              onClick={() => handleNavigation("/login")}
            >
              Sign In
            </Button>
          )}

          <Divider />

          {/* Navigation Buttons */}
          {buttonsToRender.map((buttonInfo) => (
            <Button
              key={buttonInfo.path}
              leftIcon={<Icon as={buttonInfo.icon} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              onClick={() => handleNavigation(buttonInfo.path)}
            >
              {buttonInfo.labelText}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* Overlay for Mobile */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex={9}
          onClick={onClose}
        />
      )}
    </>
  );
}
