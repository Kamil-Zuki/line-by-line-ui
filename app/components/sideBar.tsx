"use client";

import {
  Box,
  VStack,
  Text,
  Button,
  Divider,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaBars, FaCog, FaBook, FaHome } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import { IconType } from "react-icons";

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
      color: "white",
    },
    { label: "Logout", onClick: () => logout(), color: "red.800" },
  ];

  const profileActions = isAuthenticated ? actions : [];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        display={{ base: "block", md: "none" }}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex={20}
        bg="red.800"
        border="2px solid"
        borderColor="blue.900"
        color="white"
        _hover={{
          bg: "red.700",
          boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
        }}
        onClick={onOpen}
      >
        <Icon as={FaBars} />
      </Button>

      {/* Sidebar */}
      <Box
        as="nav"
        w={{ base: isOpen ? "257px" : "0", md: "257px" }}
        h={{ base: "100vh", md: "100vh" }}
        bg="gray.800"
        color="white"
        p={{ base: isOpen ? 4 : 0, md: 4 }}
        position={{ base: "fixed", md: "fixed" }}
        top={0}
        left={0}
        borderRight="2px solid"
        borderColor="blue.900"
        boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
        overflowX="hidden"
        transition="width 0.3s"
        zIndex={10}
        _before={{
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background:
            "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
          opacity: 0.3,
          zIndex: 1,
        }}
        _after={{
          content: '""',
          position: "absolute",
          top: "10%",
          left: "-2px",
          width: "60px",
          height: "2px",
          bg: "white",
          transform: "rotate(-45deg)",
          boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
          zIndex: 2,
        }}
      >
        <VStack align="stretch" spacing={4} position="relative" zIndex={3}>
          {/* Logo/Title */}
          <Text
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
            letterSpacing="wider"
            mb={4}
          >
            LBL
          </Text>

          {/* Profile Menu or Login Button */}
          {isAuthenticated && user ? (
            <ProfileMenu userName={user.userName} actions={profileActions} />
          ) : (
            <Button
              leftIcon={<Icon as={FaSignInAlt} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="white"
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              position="relative"
              overflow="hidden"
              transition="all 0.2s"
              onClick={() => handleNavigation("/login")}
            >
              Sign In
            </Button>
          )}

          <Divider borderColor="gray.600" />

          {/* Navigation Buttons */}
          {buttonsToRender.map((buttonInfo) => (
            <Button
              key={buttonInfo.path}
              leftIcon={<Icon as={buttonInfo.icon} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="white"
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              position="relative"
              overflow="hidden"
              transition="all 0.2s"
              onClick={() => handleNavigation(buttonInfo.path)}
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
              >
                {buttonInfo.labelText}
              </Text>
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