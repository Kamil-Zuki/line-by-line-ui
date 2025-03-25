"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useApi } from "@/app/lib/api";

interface Deck {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  tags: string[];
  cards: { id: string; front: string; back: string }[];
}

export default function DeckPage() {
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading) {
      fetchDeck();
    }
  }, [isAuthenticated, loading, id, router]);

  const fetchDeck = async () => {
    try {
      const data = await api.get<Deck>(`/decks/${id}`);
      setDeck(data);
    } catch (error) {
      console.error("Failed to fetch deck:", error);
      router.push("/dashboard");
    }
  };

  const handleFork = async () => {
    try {
      const forked = await api.post<{ id: string }>(`/decks/${id}/fork`, {});
      router.push(`/dashboard/decks/${forked.id}`);
    } catch (error) {
      console.error("Fork failed:", error);
    }
  };

  if (loading || !deck) return <Box>Loading...</Box>;

  return (
    <Box p={6}>
      <Heading mb={4}>{deck.title}</Heading>
      <Text mb={2}>{deck.description || "No description"}</Text>
      <HStack mb={4}>
        {deck.tags.map((tag) => (
          <Badge key={tag} colorScheme="purple">
            {tag}
          </Badge>
        ))}
        <Badge colorScheme={deck.isPublic ? "green" : "red"}>
          {deck.isPublic ? "Public" : "Private"}
        </Badge>
      </HStack>
      <HStack mb={6}>
        <Button onClick={() => router.push(`/dashboard/decks/${id}/learn`)}>
          Learn
        </Button>
        <Button onClick={() => router.push(`/dashboard/decks/${id}/cards`)}>
          Edit Cards
        </Button>
        {deck.isPublic && (
          <Button onClick={handleFork} colorScheme="yellow">
            Fork
          </Button>
        )}
      </HStack>
      <Tabs>
        <TabList>
          <Tab>Cards</Tab>
          <Tab>Stats</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              {deck.cards.map((card) => (
                <Box
                  key={card.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  w="full"
                >
                  <Text>Front: {card.front}</Text>
                  <Text>Back: {card.back}</Text>
                </Box>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel>
            <Text>Stats coming soon...</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
