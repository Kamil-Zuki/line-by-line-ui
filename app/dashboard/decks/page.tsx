"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

export default function MyDecksPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchDecks = async () => {
      try {
        const myDecks: DeckResponse[] = await fetchApi("/decks/my-decks");
        setDecks(myDecks);
      } catch (error: any) {
        console.error("Error fetching decks:", error.message, {
          status: error.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [isAuthenticated, authLoading]);

  const handleDeckClick = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}`);
  };

  if (authLoading || !isAuthenticated) return null; // Middleware redirects
  if (loading) return <Text>Loading decks...</Text>;

  return (
    <Box p={6}>
      <Heading size="lg">My Decks, {user?.userName}</Heading>
      {decks.length > 0 ? (
        <VStack mt={4} spacing={4} align="stretch">
          {decks.map((deck) => (
            <Box
              key={deck.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.100", cursor: "pointer" }}
              onClick={() => handleDeckClick(deck.id)}
            >
              <Text fontSize="xl" fontWeight="bold">
                {deck.title}
              </Text>
              <Text>{deck.description || "No description"}</Text>
              <Text fontSize="sm" color="gray.500">
                Cards: {deck.cardCount ?? "N/A"} • Created:{" "}
                {new Date(deck.createdDate).toLocaleDateString()}
              </Text>
            </Box>
          ))}
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => router.push("/dashboard/decks/new")}
          >
            Create New Deck
          </Button>
        </VStack>
      ) : (
        <Box mt={4}>
          <Text>No decks yet.</Text>
          <Button
            mt={2}
            colorScheme="teal"
            onClick={() => router.push("/dashboard/decks/new")}
          >
            Create Your First Deck
          </Button>
        </Box>
      )}
    </Box>
  );
}
