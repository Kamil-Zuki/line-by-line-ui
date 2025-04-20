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
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import MainLayout from "@/app/components/MainLayout"; // Fixed import path

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let message = await register(email, password, confirmPassword);
      toast({
        title: `Registration Successful. ${message}`,
        description: "You can now log in!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      setError(error.message || "Registration failed");
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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
          Register
        </Text>
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          bg="#171717"
          isLoading={loading}
          width="full"
        >
          Register
        </Button>
        <Text>
          Already have an account?{" "}
          <ChakraLink href="/login" color="teal.500">
            Login
          </ChakraLink>
        </Text>
      </VStack>
    </MainLayout>
  );
}
