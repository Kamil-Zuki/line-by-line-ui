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
import MainLayout from "@/app/components/MainLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added missing useState
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Now works with useState
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Now works with useState
    }
  };

  return (
    <MainLayout>
      <VStack
        spacing={6}
        as="form"
        onSubmit={handleSubmit}
        maxW="400px"
        mx="auto"
        mt={8}
      >
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          width="full"
        >
          Login
        </Button>
        <Text>
          Don’t have an account?{" "}
          <ChakraLink href="/register" color="teal.500">
            Register
          </ChakraLink>
        </Text>
      </VStack>
    </MainLayout>
  );
}
