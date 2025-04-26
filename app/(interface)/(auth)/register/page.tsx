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
      let message = await register(email, password, confirmPassword);
      toast({
        title: `Registration Successful. ${message}`,
        description: "You can now log in!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error: any) {
      setError(error.message || "Registration failed");
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong",
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
        boxShadow: "0 0 15px rgba(229, 62, 62, 0.5)", // Red glow
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
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(229, 62, 62, 0.5)" // Red glow
          textAlign="center"
        >
          Register
        </Text>
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl isRequired isInvalid={!!error}>
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
              _focus={{ borderColor: "red.600", boxShadow: "0 0 0 1px red.600" }}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!error}>
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
              _focus={{ borderColor: "red.600", boxShadow: "0 0 0 1px red.600" }}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel
              fontSize="sm"
              fontWeight="extrabold"
              color="gray.400"
              textTransform="uppercase"
            >
              Confirm Password
            </FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              bg="gray.700"
              borderColor="white"
              color="white"
              borderRadius="0"
              borderWidth="2px"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "red.600", boxShadow: "0 0 0 1px red.600" }}
            />
            {error && (
              <FormErrorMessage
                color="red.500"
                fontWeight="bold"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
              >
                {error}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            type="submit"
            size="lg"
            variant="solid"
            bg="red.600"
            color="white"
            w="100%"
            isLoading={loading}
            _hover={{
              bg: "red.700",
              transform: "scale(0.98)",
              boxShadow: "0 0 15px rgba(229, 62, 62, 0.7)",
            }}
          >
            Register
          </Button>
          <Text fontSize="sm" color="gray.400">
            Already have an account?{" "}
            <ChakraLink
              as={Link}
              href="/login"
              color="blue.500"
              fontWeight="bold"
              _hover={{ color: "blue.600", textDecoration: "underline" }}
            >
              Login
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}