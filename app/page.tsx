import { Box, Heading, Button, Stack, Text, Container } from "@chakra-ui/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const isAuthenticated = !!accessToken;

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    redirect("/dashboard/decks");
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="container.md" textAlign="center">
        <Heading
          as="h1"
          size="2xl"
          mb={4}
          color="gray.800"
        >
          Welcome to LineByLine
        </Heading>
        <Text
          fontSize="lg"
          mb={8}
          color="gray.600"
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