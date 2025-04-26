import { Box, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFoundPage() {
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
        boxShadow: "0 0 15px rgba(229, 62, 62, 0.5)", // Red glow for error vibe
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
        maxW="500px"
        w="100%"
        position="relative"
        zIndex={2}
        textAlign="center"
      >
        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl" }}
          mb={6}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(229, 62, 62, 0.5)" // Red glow
        >
          404 - Page Not Found
        </Heading>
        <Button
          as={Link}
          href="/"
          size="lg"
          variant="solid"
          bg="blue.500"
          color="white"
          _hover={{
            bg: "blue.600",
            transform: "scale(0.98)",
            boxShadow: "0 0 15px rgba(49, 130, 206, 0.7)",
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </Box>
  );
}