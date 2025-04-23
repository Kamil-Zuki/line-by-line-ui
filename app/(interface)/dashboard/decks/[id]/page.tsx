"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

interface CardResponse {
  id: string;
  front: string;
  back: string;
  hint?: string;
  skill: "Reading" | "Writing" | "Speaking" | "Listening";
  createdDate: string;
}

export default function DeckDetailPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || authLoading || !deckId) return;

    const fetchDeckAndCards = async () => {
      try {
        const deckData: DeckResponse = await fetchApi(`/deck/${deckId}`);
        const cardData: CardResponse[] = await fetchApi(
          `/card/${deckId}/cards`
        );
        setDeck(deckData);
        setCards(cardData);
      } catch (error: any) {
        console.error("Error fetching deck/cards:", error.message, {
          status: error.status,
        });
        toast({
          title: "Error",
          description: "Failed to load deck or cards.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [isAuthenticated, authLoading, deckId, toast]);

  const handleLearn = () => {
    router.push(`/dashboard/decks/${deckId}/learn`);
  };

  if (authLoading || !isAuthenticated) return null;
  if (loading) return <Text>Loading deck...</Text>;
  if (!deck) return <Text>Deck not found.</Text>;

  return (
    <Box p={6}>
      <Heading size="lg">{deck.title}</Heading>
      <Text mt={2}>{deck.description || "No description"}</Text>
      <Text fontSize="sm" color="gray.500">
        Cards: {deck.cardCount} • Created:{" "}
        {new Date(deck.createdDate).toLocaleDateString()}
        {deck.isSubscribed ? " • Subscribed" : ""}
      </Text>
      <HStack mt={4} spacing={4}>
        <Button colorScheme="teal" onClick={handleLearn}>
          Learn
        </Button>
        {deck.ownerId === user?.id && (
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/decks/${deckId}/edit`)}
          >
            Edit Deck
          </Button>
        )}
      </HStack>
      <VStack mt={6} spacing={4} align="stretch">
        <Heading size="md">Cards</Heading>
        {cards.length > 0 ? (
          cards.map((card) => (
            <Box key={card.id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{card.front}</Text>
              <Text>{card.back}</Text>
              {card.hint && (
                <Text fontSize="sm" color="gray.500">
                  Hint: {card.hint}
                </Text>
              )}
              <Text fontSize="sm" color="gray.500">
                Skill: {card.skill}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No cards in this deck yet.</Text>
        )}
      </VStack>
    </Box>
  );
}
