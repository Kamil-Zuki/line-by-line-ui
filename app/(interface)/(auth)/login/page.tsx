"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text as ChakraText,
  Link as ChakraLink,
  useToast,
  CloseButton,
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
      showToast("Login Successful", "", "success");
    } catch (error: any) {
      showToast("Login Failed", error.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  // Custom toast renderer for Ultimate Spider-Man style
  const showToast = (title: string, description: string, status: "success" | "error") => {
    toast({
      position: "top",
      duration: status === "success" ? 3000 : 5000,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <ChakraText fontWeight="bold" fontSize="md">{title}</ChakraText>
            {description && <ChakraText fontSize="sm">{description}</ChakraText>}
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      p={{ base: 4, md: 8 }}
      bg="gray.800"
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
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
    >
      {/* Main Content Container */}
      <Box
        bg="gray.800"
        p={{ base: 6, md: 10 }}
        border="2px solid"
        borderColor="blue.900"
        boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
        maxW="400px"
        w="100%"
        position="relative"
        zIndex={3}
        borderRadius="md"
      >
        <ChakraText
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="extrabold"
          mb={6}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(66, 153, 225, 0.3)" // Soft blue glow
          textAlign="center"
        >
          Login
        </ChakraText>
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
              border="2px solid"
              borderColor="blue.900"
              color="white"
              borderRadius="md"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.700", boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)" }}
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
              border="2px solid"
              borderColor="blue.900"
              color="white"
              borderRadius="md"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.700", boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)" }}
            />
          </FormControl>
          <Button
            type="submit"
            size="lg"
            bg="red.800"
            border="2px solid"
            borderColor="blue.900"
            color="white"
            w="100%"
            isLoading={loading}
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
          >
            Login
          </Button>
          <ChakraText fontSize="sm" color="gray.300" textAlign="center">
            Don’t have an account?{" "}
            <ChakraLink
              as={Link}
              href="/register"
              color="red.500"
              fontWeight="bold"
              _hover={{ color: "red.400", textDecoration: "underline" }}
            >
              Register
            </ChakraLink>
          </ChakraText>
        </VStack>
      </Box>
    </Box>
  );
}