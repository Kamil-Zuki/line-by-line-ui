"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";

interface Deck {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
}

interface Card {
  id: string;
  front: string;
  back: string;
}

export default function DeckDetailPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDeck = async () => {
      setLoading(true);
      try {
        const deckRes = await fetch(`/api/personal-vocab/decks/${deckId}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          credentials: "include",
        });
        if (!deckRes.ok) throw new Error("Failed to fetch deck");

        const cardsRes = await fetch(`/api/personal-vocab/cards/deck/${deckId}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          credentials: "include",
        });
        if (!cardsRes.ok) throw new Error("Failed to fetch cards");

        const deckData = await deckRes.json();
        const cardsData = await cardsRes.json();
        console.log("Deck fetched:", deckData); // Debug log
        console.log("Cards fetched:", cardsData); // Debug log
        setDeck(deckData);
        setCards(cardsData);
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

    fetchDeck();
  }, [isAuthenticated, tokens.accessToken, deckId, router, toast]);

  if (!isAuthenticated) return null;
  if (loading) return <Spinner size="xl" m={8} />;
  if (!deck) return <Text>Deck not found</Text>;

  return (
    <Box>
      <Heading size="lg" mb={4}>
        {deck.title}
      </Heading>
      <Text mb={6}>{deck.description || "No description"}</Text>
      <VStack align="stretch" spacing={4}>
        <Text fontSize="lg" fontWeight="bold">
          Cards ({deck.cardCount})
        </Text>
        {cards.length > 0 ? (
          cards.map((card) => (
            <Box
              key={card.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontWeight="bold">{card.front}</Text>
              <Text color="gray.600">{card.back}</Text>
            </Box>
          ))
        ) : (
          <Text>No cards in this deck yet.</Text>
        )}
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() => router.push(`/dashboard/decks/${deckId}/contribute`)}
        >
          Add Card
        </Button>
      </VStack>
    </Box>
  );
}