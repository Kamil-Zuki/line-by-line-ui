import { Box, Heading, Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  const isAuthenticated = !!token;

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    redirect("/dashboard/decks");
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      bg="white"
      color="black"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      p={4}
    >
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to LineByLine
      </Heading>
      <Text fontSize="xl" mb={6} color="gray.600">
        Learn languages through gamified decks, collaboration, and AI-powered progress tracking.
      </Text>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <Button as={Link} href="/login" colorScheme="blue" size="lg">
          Login
        </Button>
        <Button as={Link} href="/register" colorScheme="teal" size="lg">
          Register
        </Button>
      </Stack>
    </Box>
  );
}