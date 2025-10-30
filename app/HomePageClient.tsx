"use client";

import { Box, Heading, Button, Stack, Text, Container, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

/**
 * Home Page Client Component
 * Handles color mode and interactive elements
 */
export default function HomePageClient() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      bg={bgColor}
    >
      <Container maxW="container.md" textAlign="center">
        <Heading
          as="h1"
          size="2xl"
          mb={4}
          color={headingColor}
        >
          Welcome to LineByLine
        </Heading>
        <Text
          fontSize="lg"
          mb={8}
          color={textColor}
        >
          Learn languages through gamified decks, collaboration, and AI-powered progress tracking.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={4} justify="center">
          <Button
            as={Link}
            href="/login"
            size="lg"
            colorScheme="brand"
          >
            Login
          </Button>
          <Button
            as={Link}
            href="/register"
            size="lg"
            variant="outline"
            colorScheme="brand"
          >
            Register
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

