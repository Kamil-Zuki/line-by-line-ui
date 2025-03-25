"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Heading,
  Text,
  Button,
  Progress,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useApi } from "../lib/api";

interface DeckStats {
  id: string;
  title: string;
  cardsDue: number;
  totalCards: number;
}

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [stats, setStats] = useState<{
    newCards: number;
    reviews: number;
    decks: DeckStats[];
  }>({
    newCards: 0,
    reviews: 0,
    decks: [],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading) {
      fetchStats();
    }
  }, [isAuthenticated, loading, router]);

  const fetchStats = async () => {
    try {
      const settings = await api.get<{
        newCardsCompletedToday: number;
        reviewsCompletedToday: number;
      }>("/settings");
      const decks = await api.get<DeckStats[]>("/decks/my-decks");
      setStats({
        newCards: settings.newCardsCompletedToday,
        reviews: settings.reviewsCompletedToday,
        decks: decks.map((d) => ({ ...d, cardsDue: 5 })), // Mocked due count; replace with real API
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (loading) return <Box>Loading...</Box>;

  return (
    <Box p={6}>
      <Heading mb={4}>Welcome to LinguaForge</Heading>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Box flex={1}>
            <Text>New Cards Today: {stats.newCards}/10</Text>
            <Progress value={(stats.newCards / 10) * 100} colorScheme="green" />
          </Box>
          <Box flex={1}>
            <Text>Reviews Today: {stats.reviews}/20</Text>
            <Progress value={(stats.reviews / 20) * 100} colorScheme="blue" />
          </Box>
        </HStack>
        <Heading size="md">Your Decks</Heading>
        {stats.decks.map((deck) => (
          <HStack key={deck.id} p={4} borderWidth={1} borderRadius="md">
            <Text flex={1}>{deck.title}</Text>
            <Text>Cards Due: {deck.cardsDue}</Text>
            <Button
              onClick={() => router.push(`/dashboard/decks/${deck.id}/learn`)}
            >
              Learn
            </Button>
          </HStack>
        ))}
        <Button
          colorScheme="teal"
          onClick={() => router.push("/dashboard/decks/new")}
        >
          Create New Deck
        </Button>
      </VStack>
    </Box>
  );
}
