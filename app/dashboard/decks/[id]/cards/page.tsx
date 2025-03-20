"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";

interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

export default function DeckCardsPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: deckId } = useParams();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/personal-vocab/cards/deck/${deckId}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cards");
        const data = await res.json();
        setCards(data);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, status: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [isAuthenticated, tokens.accessToken, deckId, router, toast]);

  const handleAddCard = async () => {
    if (!front.trim() || !back.trim()) {
      toast({
        title: "Error",
        description: "Front and back are required",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/personal-vocab/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ deckId, front, back }),
      });
      if (!res.ok) throw new Error("Failed to add card");
      const newCard = await res.json();
      setCards([...cards, newCard]);
      setFront("");
      setBack("");
      toast({ title: "Success", description: "Card added", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/personal-vocab/cards/${cardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete card");
      setCards(cards.filter((c) => c.id !== cardId));
      toast({
        title: "Success",
        description: "Card deleted",
        status: "success",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <Box>Loading...</Box>;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Cards
      </Heading>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Input
            placeholder="Front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            mb={2}
          />
          <Input
            placeholder="Back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            mb={2}
          />
          <Button
            colorScheme="teal"
            onClick={handleAddCard}
            isLoading={loading}
          >
            Add Card
          </Button>
        </Box>
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
              <Text>{card.back}</Text>
              <Button
                colorScheme="red"
                size="sm"
                mt={2}
                onClick={() => handleDeleteCard(card.id)}
              >
                Delete
              </Button>
            </Box>
          ))
        ) : (
          <Text>No cards in this deck yet.</Text>
        )}
      </VStack>
    </Box>
  );
}
