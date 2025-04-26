"use client";

import { Box, VStack, Text, Button, Divider, Icon, useDisclosure } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaBars } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import { IconType } from "react-icons";

interface SideBarButtonData {
  icon: IconType;
  path: string;
  labelText: string;
}

interface SideBarProps {
  buttonData: SideBarButtonData[];
}

export default function SideBar({ buttonData }: SideBarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const actions = [
    { label: "Open Profile", onClick: () => handleNavigation("/profile"), color: "white" },
    { label: "Logout", onClick: () => logout(), color: "red.500" },
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
        bg="red.500"
        border="2px solid"
        borderColor="blue.500"
        color="white"
        _hover={{
          bg: "red.600",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
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
        bg="black"
        color="white"
        p={{ base: isOpen ? 4 : 0, md: 4 }}
        position={{ base: "fixed", md: "fixed" }}
        top={0}
        left={0}
        borderRight="2px solid"
        borderColor="red.500"
        boxShadow="0 0 15px rgba(59, 130, 246, 0.5)" // Blue glow for Spidey
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
          background: "radial-gradient(circle at 5% 5%, transparent 0%, transparent 5%, white 6%, transparent 7%)",
          backgroundSize: "20px 20px",
          opacity: 0.1,
          zIndex: 1,
        }}
        _after={{
          content: '""',
          position: "absolute",
          top: "10%",
          left: "-5px",
          width: "100px",
          height: "2px",
          bg: "white",
          transform: "rotate(-45deg)",
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
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
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 215, 0, 0.5)" // Yellow glow
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
              bg="red.500"
              border="2px solid"
              borderColor="blue.500"
              _hover={{
                bg: "red.600",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)", // Yellow glow
                _after: {
                  opacity: 0.3,
                  transform: "rotate(45deg) translate(20%, 20%)",
                },
              }}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "radial-gradient(circle at 10% 10%, transparent 0%, transparent 10%, white 11%, transparent 12%)",
                backgroundSize: "15px 15px",
                opacity: 0.1,
                zIndex: 1,
              }}
              _after={{
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent, blue.500, transparent)",
                opacity: 0,
                transform: "rotate(45deg)",
                transition: "opacity 0.3s, transform 0.3s",
                zIndex: 0,
              }}
            >
              Sign In
            </Button>
          )}

          <Divider borderColor="gray.600" />

          {/* Navigation Buttons */}
          {buttonData.map((buttonInfo) => (
            <Button
              key={buttonInfo.path}
              leftIcon={<Icon as={buttonInfo.icon} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="white"
              bg="red.500"
              border="2px solid"
              borderColor="blue.500"
              _hover={{
                bg: "red.600",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)", // Yellow glow
                _after: {
                  opacity: 0.3,
                  transform: "rotate(45deg) translate(20%, 20%)",
                },
              }}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "radial-gradient(circle at 10% 10%, transparent 0%, transparent 10%, white 11%, transparent 12%)",
                backgroundSize: "15px 15px",
                opacity: 0.1,
                zIndex: 1,
              }}
              _after={{
                content: '""',
                position: "absolute",
                top: " masa-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "linear-gradient(45deg, transparent, blue.500, transparent)",
                opacity: 0,
                transform: "rotate(45deg)",
                transition: "opacity 0.3s, transform 0.3s",
                zIndex: 0,
              }}
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