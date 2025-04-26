"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      p={{ base: 4, md: 8 }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        border: "3px solid",
        borderColor: "white",
        boxShadow: "0 0 15px rgba(49, 130, 206, 0.5)", // Blue glow
        zIndex: 1,
      }}
    >
      {/* Main Content Container */}
      <Box
        bg="gray.800"
        p={{ base: 6, md: 10 }}
        border="2px solid"
        borderColor="white"
        boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)"
        maxW="400px"
        w="100%"
        position="relative"
        zIndex={2}
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="extrabold"
          mb={6}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(49, 130, 206, 0.5)" // Blue glow
          textAlign="center"
        >
          Login
        </Text>
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="extrabold"
              color="gray.400"
              textTransform="uppercase"
            >
              Email
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              bg="gray.700"
              borderColor="white"
              color="white"
              borderRadius="0"
              borderWidth="2px"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel
              fontSize="sm"
              fontWeight="extrabold"
              color="gray.400"
              textTransform="uppercase"
            >
              Password
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              bg="gray.700"
              borderColor="white"
              color="white"
              borderRadius="0"
              borderWidth="2px"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
            />
          </FormControl>
          <Button
            type="submit"
            size="lg"
            variant="solid"
            bg="blue.500"
            color="white"
            w="100%"
            isLoading={loading}
            _hover={{
              bg: "blue.600",
              transform: "scale(0.98)",
              boxShadow: "0 0 15px rgba(49, 130, 206, 0.7)",
            }}
          >
            Login
          </Button>
          <Text fontSize="sm" color="gray.400">
            Don’t have an account?{" "}
            <ChakraLink
              as={Link}
              href="/register"
              color="red.600"
              fontWeight="bold"
              _hover={{ color: "red.500", textDecoration: "underline" }}
            >
              Register
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}