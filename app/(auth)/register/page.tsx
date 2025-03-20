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
  FormErrorMessage,
} from "@chakra-ui/react";
import MainLayout from "@/app/components/layout";
import { useAuth } from "@/app/hooks/useAuth";
import NextLink from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Password match check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    register(email, password, confirmPassword).catch((err: any) => {
      setError(err.message || "Registration failed");
    });
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
          Register
        </Text>

        <FormControl
          isRequired
          isInvalid={!!error && password !== confirmPassword}
        >
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

        <FormControl
          isRequired
          isInvalid={!!error && password !== confirmPassword}
        >
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          {error && password !== confirmPassword && (
            <FormErrorMessage>{error}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          width="full"
        >
          Register
        </Button>

        {error && password === confirmPassword && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <Text>
          Already have an account?{" "}
          <ChakraLink as={NextLink} href="/login" color="teal.500">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </MainLayout>
  );
}
