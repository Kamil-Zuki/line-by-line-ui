"use client";

import { Box, VStack, Text, Button, Divider, Icon } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaLayerGroup,
  FaPlus,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

export default function SideBar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      as="nav"
      w={{ base: "full", md: "250px" }}
      h={{ base: "auto", md: "100vh" }}
      bg="gray.800"
      color="white"
      p={4}
      position={{ base: "static", md: "fixed" }}
      top={0}
      left={0}
      borderRight="1px solid"
      borderColor="gray.700"
      boxShadow={{ base: "none", md: "lg" }}
      zIndex={10}
    >
      <VStack align="stretch" spacing={4}>
        {/* Logo/Title */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="teal.300"
          letterSpacing="wider"
          mb={4}
        >
          LBL
        </Text>

        {/* Navigation Items */}
        {isAuthenticated ? (
          <>
            <Button
              leftIcon={<Icon as={FaHome} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="gray.200"
              _hover={{ bg: "gray.700", color: "teal.300" }}
              onClick={() => handleNavigation("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              leftIcon={<Icon as={FaLayerGroup} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="gray.200"
              _hover={{ bg: "gray.700", color: "teal.300" }}
              onClick={() => handleNavigation("/dashboard/decks")}
            >
              My Decks
            </Button>
            <Button
              leftIcon={<Icon as={FaSearch} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="gray.200"
              _hover={{ bg: "gray.700", color: "teal.300" }}
              onClick={() => handleNavigation("/dashboard/decks/search")}
            >
              Search Decks
            </Button>
            <Divider borderColor="gray.600" />

            <Button
              leftIcon={<Icon as={FaUser} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="gray.200"
              _hover={{ bg: "gray.700", color: "teal.300" }}
              onClick={() => handleNavigation("/profile")}
            >
              Profile
            </Button>
            <Button
              leftIcon={<Icon as={FaSignOutAlt} />}
              variant="ghost"
              justifyContent="start"
              w="full"
              color="red.400"
              _hover={{ bg: "gray.700", color: "red.300" }}
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            leftIcon={<Icon as={FaSignInAlt} />}
            variant="ghost"
            justifyContent="start"
            w="full"
            color="gray.200"
            _hover={{ bg: "gray.700", color: "teal.300" }}
            onClick={() => handleNavigation("/login")}
          >
            Login
          </Button>
        )}
      </VStack>
    </Box>
  );
}
