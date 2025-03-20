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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    register(email, password, confirmPassword);
  };

  return (
    <MainLayout>
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Text fontSize="2xl" fontWeight="bold">
          Register
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
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          width="full"
        >
          Register
        </Button>
        <Text>
          Already have an account?{" "}
          <ChakraLink href="/auth/login" color="teal.500">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </MainLayout>
  );
}
