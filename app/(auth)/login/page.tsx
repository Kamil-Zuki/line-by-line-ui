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
} from "@chakra-ui/react";
import MainLayout from "@/app/components/layout";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <MainLayout>
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
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
