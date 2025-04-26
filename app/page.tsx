import { Box, Heading, Button, Stack, Text } from "@chakra-ui/react";
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
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
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
        maxW="600px"
        w="100%"
        position="relative"
        zIndex={2}
      >
        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl" }}
          mb={4}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(49, 130, 206, 0.5)" // Blue glow
        >
          Welcome to LineByLine
        </Heading>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          mb={6}
          color="gray.400"
          fontWeight="bold"
        >
          Learn languages through gamified decks, collaboration, and AI-powered progress tracking.
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Button
            as={Link}
            href="/login"
            size="lg"
            variant="solid"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600", transform: "scale(0.98)", boxShadow: "0 0 15px rgba(49, 130, 206, 0.7)" }}
          >
            Login
          </Button>
          <Button
            as={Link}
            href="/register"
            size="lg"
            variant="solid"
            bg="red.600"
            color="white"
            _hover={{ bg: "red.700", transform: "scale(0.98)", boxShadow: "0 0 15px rgba(229, 62, 62, 0.7)" }}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}