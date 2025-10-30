"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
  useToast,
  Container,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";

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
      const result = await register(email, password, confirmPassword);
      if (result.success) {
        toast({
          title: "Registration Successful",
          description: result.message ? `${result.message} You can now log in!` : "You can now log in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // No redirect after successful registration
      } else {
        setError(result.error || "Registration failed");
        toast({
          title: "Registration Failed",
          description: result.error || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      setError(error.message || "Registration failed");
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="md">
        <Card>
          <CardBody p={8}>
            <Heading as="h1" size="lg" mb={6} textAlign="center">
              Register
            </Heading>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
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
                size="lg"
                colorScheme="brand"
                w="100%"
                isLoading={loading}
              >
                Register
              </Button>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Already have an account?{" "}
                <ChakraLink
                  as={Link}
                  href="/login"
                  color="brand.600"
                  fontWeight="semibold"
                >
                  Login
                </ChakraLink>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}