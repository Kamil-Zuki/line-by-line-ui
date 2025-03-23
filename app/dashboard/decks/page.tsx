"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Deck {
  id: string;
  title: string;
  cardCount: number;
}

export default function DecksPage() {
  const { tokens, isAuthenticated, refreshToken } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDecks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/personal-vocab/decks/my-decks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) return fetchDecks();
            throw new Error("Session expired, please log in again");
          }
          throw new Error(`Failed to fetch decks: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Decks fetched:", data); // Debug log
        setDecks(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [isAuthenticated, tokens.accessToken, refreshToken, router, toast]);

  if (!isAuthenticated) return null;
  if (loading) return <Spinner size="xl" m={8} />;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        My Decks
      </Heading>
      <VStack align="stretch" spacing={4}>
        {decks.length > 0 ? (
          decks.map((deck) => (
            <Box
              key={deck.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", cursor: "pointer" }}
              onClick={() => router.push(`/dashboard/decks/${deck.id}`)}
            >
              <Text fontSize="lg" fontWeight="bold">
                {deck.title}
              </Text>
              <Text color="gray.600">{deck.cardCount} cards</Text>
            </Box>
          ))
        ) : (
          <Text>No decks found. Create one to get started!</Text>
        )}
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() => router.push("/dashboard/decks/new")}
        >
          Create New Deck
        </Button>
      </VStack>
    </Box>
  );
}