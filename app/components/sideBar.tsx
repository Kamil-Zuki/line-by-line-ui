"use client";

import { Box, VStack, Text, Button, Divider } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <Box
      as="nav"
      w={{ base: "full", md: "250px" }}
      h={{ base: "auto", md: "100vh" }}
      bg="gray.100"
      p={4}
      position={{ base: "static", md: "fixed" }}
      top={0}
      left={0}
      borderRight="1px solid"
      borderColor="gray.200"
    >
      <VStack align="start" spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          LBL
        </Text>
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              onClick={() => router.push("/dashboard/decks")}
            >
              My Decks
            </Button>
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              onClick={() => router.push("/dashboard/decks/new")}
            >
              Create New Deck
            </Button>
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              onClick={() => router.push("/dashboard/decks/search")}
            >
              Search Decks
            </Button>
            <Divider />
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              onClick={() => router.push("/profile")}
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              w="full"
              justifyContent="start"
              colorScheme="red"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            w="full"
            justifyContent="start"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        )}
      </VStack>
    </Box>
  );
}