"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useParams } from "next/navigation";

interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

export default function LearnPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id: deckId } = useParams();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated, tokens.accessToken, deckId, toast]);

  const handleNext = () => {
    setShowBack(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setShowBack(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (!isAuthenticated) return null;
  if (loading) return <Box>Loading...</Box>;
  if (cards.length === 0) return <Box>No cards to learn in this deck.</Box>;

  const currentCard = cards[currentCardIndex];

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Learn
      </Heading>
      <Box p={6} bg="white" borderRadius="md" boxShadow="sm" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          {showBack ? currentCard.back : currentCard.front}
        </Text>
        <Button mt={4} onClick={() => setShowBack(!showBack)}>
          {showBack ? "Show Front" : "Show Back"}
        </Button>
      </Box>
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button onClick={handlePrevious} disabled={cards.length <= 1}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={cards.length <= 1}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
