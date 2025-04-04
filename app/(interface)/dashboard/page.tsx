"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Select,
  HStack,
  Button,
  Icon,
  Image,
} from "@chakra-ui/react";
import { FaLockOpen } from "react-icons/fa"; // For the open lock icon
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

interface Stats {
  deckCount: number;
  totalCards: number;
}

// New type for sorting options
type SortOption = "trending" | "newest" | "top";

export default function DashboardPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [publicDecks, setPublicDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("trending");

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchData = async () => {
      try {
        // Fetch user stats (my decks)
        const myDecks: DeckResponse[] = await fetchApi("/decks/my-decks");
        const deckCount = myDecks.length;
        const totalCards = myDecks.reduce(
          (sum, deck) => sum + deck.cardCount,
          0
        );
        setStats({ deckCount, totalCards });

        // Fetch public decks
        const decks: DeckResponse[] = await fetchApi("/decks/public");
        setPublicDecks(decks);
      } catch (error: any) {
        console.error("Error fetching data:", error.message, {
          status: error.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading]);

  // Filter and sort decks
  const filteredDecks = publicDecks
    .filter((deck) =>
      languageFilter === "all" ? true : deck.tags.includes(languageFilter)
    )
    .sort((a, b) => {
      if (sortOption === "trending")
        return b.subscriberCount - a.subscriberCount;
      if (sortOption === "newest")
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      if (sortOption === "top")
        return b.averageDifficulty - a.averageDifficulty; // Example metric
      return 0;
    });

  if (authLoading || !isAuthenticated) return null; // Middleware redirects to /login
  if (loading) return <Text>Loading...</Text>;

  return (
    <Box p={6}>
      {/* Header */}
      <Heading as="h1" size="xl" mb={4}>
        Community Creations
      </Heading>

      {/* Filters */}
      <HStack mb={6} spacing={4}>
        {/* Language Dropdown */}
        <Select
          w="200px"
          bgGradient="linear(to-r, #F5546A, #558AFE)"
          color="white"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="all">All Languages</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          {/* Add more languages as needed */}
        </Select>

        {/* Sort Switcher */}
        <HStack spacing={2}>
          <Button
            variant={sortOption === "trending" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setSortOption("trending")}
          >
            Trending
          </Button>
          <Button
            variant={sortOption === "newest" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setSortOption("newest")}
          >
            Newest
          </Button>
          <Button
            variant={sortOption === "top" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setSortOption("top")}
          >
            Top
          </Button>
        </HStack>
      </HStack>

      {/* Deck Gallery */}
      <Flex wrap="wrap" justify="flex-start" gap={6}>
        {filteredDecks.map((deck) => (
          <Box
            key={deck.id}
            w="300px"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            position="relative"
          >
            {/* Deck Image */}
            {deck.imageUrl ? (
              <Image
                src={deck.imageUrl}
                alt={deck.title}
                borderRadius="md"
                mb={2}
                h="150px"
                objectFit="cover"
              />
            ) : (
              <Box bg="gray.200" h="150px" borderRadius="md" mb={2} />
            )}

            {/* Deck Info */}
            <Text fontSize="lg" fontWeight="bold">
              {deck.title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {deck.description || "No description"}
            </Text>
            <Text fontSize="sm" mt={2}>
              Cards: {deck.cardCount} | Subscribers: {deck.subscriberCount}
            </Text>

            {/* Open Lock Icon */}
            <Icon
              as={FaLockOpen}
              position="absolute"
              bottom={2}
              right={2}
              color="green.500"
              boxSize={6}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
