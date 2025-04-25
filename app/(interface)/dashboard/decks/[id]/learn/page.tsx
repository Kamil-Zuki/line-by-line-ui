"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, CardDto } from "@/app/lib/api";
import { CardReview } from "@/app/components/ui/CardReview";

export default function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<CardDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  // Unwrap params using React.use
  const { id } = React.use(params);

  // Fetch due cards
  useEffect(() => {
    const fetchDueCards = async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi<CardDto[]>(`/card/due?deckId=${id}`);
        setCards(response);
      } catch (error: any) {
        console.error("Error fetching due cards:", error.message, {
          status: error.status,
        });
        toast({
          title: "Error",
          description: "Failed to load due cards. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push(`/dashboard/decks/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchDueCards();
    }
  }, [isAuthenticated, authLoading, id, router, toast]);

  // Handle review submission
  const handleReview = async (quality: number) => {
    try {
      await fetchApi(`/card/review/${cards[currentIndex].id}`, {
        method: "POST",
        body: JSON.stringify({ quality }),
      });
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast({
          title: "Review Complete",
          description: "All due cards reviewed!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push(`/dashboard/decks/${id}`);
      }
    } catch (error: any) {
      console.error("Error submitting review:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (cards.length === 0) {
    return (
      <Box p={{ base: 4, md: 6 }} maxW="800px" mx="auto">
        <Heading as="h1" size="lg" mb={6}>
          Learn Deck
        </Heading>
        <Text mb={4}>No due cards for this deck.</Text>
        <Button
          colorScheme="teal"
          onClick={() => router.push(`/dashboard/decks/${id}`)}
        >
          Back to Deck
        </Button>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} maxW="800px" mx="auto">
      <Heading as="h1" size="lg" mb={6}>
        Learn Deck
      </Heading>
      <CardReview card={cards[currentIndex]} onReview={handleReview} />
      <Text mt={4}>
        Card {currentIndex + 1} of {cards.length}
      </Text>
    </Box>
  );
}
