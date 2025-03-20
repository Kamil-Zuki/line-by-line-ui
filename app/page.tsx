import { Box, Heading, Button, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function MainPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  const isAuthenticated = !!token;

  return (
    <Box
      display="flex"
      flexDirection="column"
      bg="white"
      color="black"
      fontSize="5xl"
      h="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Heading mb={6}>Welcome to LineByLine</Heading>

      {!isAuthenticated && (
        <Stack direction="row" spacing={4}>
          <Button as={Link} href="/login" colorScheme="blue" size="lg">
            Login
          </Button>
          <Button as={Link} href="/register" colorScheme="teal" size="lg">
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
}
