//app\(interface)\dashboard\decks\search\page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useApi } from "@/app/lib/api";

interface Deck {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  subscribers: number;
}

export default function SearchDecks() {
  const router = useRouter();
  const api = useApi();
  const [query, setQuery] = useState("");
  const [decks, setDecks] = useState<Deck[]>([]);

  const search = async () => {
    try {
      const results = await api.get<Deck[]>(
        `/search/deck?query=${encodeURIComponent(query)}`
      );
      setDecks(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    search(); // Initial load of public decks
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Discover Decks</Heading>
      <HStack mb={6}>
        <Input
          placeholder="Search public decks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={search} colorScheme="teal">
          Search
        </Button>
      </HStack>
      <VStack spacing={4} align="stretch">
        {decks.map((deck) => (
          <HStack key={deck.id} p={4} borderWidth={1} borderRadius="md">
            <VStack align="start" flex={1}>
              <Text fontWeight="bold">{deck.title}</Text>
              <Text fontSize="sm" color="gray.500">
                {deck.description || "No description"}
              </Text>
              <HStack>
                {deck.tags.map((tag) => (
                  <Badge key={tag} colorScheme="purple">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </VStack>
            <Text>Subscribers: {deck.subscribers}</Text>
            <Button onClick={() => router.push(`/dashboard/decks/${deck.id}`)}>
              View
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
