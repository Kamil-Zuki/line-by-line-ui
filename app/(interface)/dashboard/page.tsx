"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { DeckResponse } from "@/app/interfaces";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";
import { fetchApi } from "@/app/lib/api";

interface Stats {
  deckCount: number;
  totalCards: number;
}

type FilterOption = "all" | "english" | "spanish";
type SortOption = "trending" | "newest" | "top";

interface FilterOptionConfig {
  value: FilterOption;
  label: string;
}

interface SortOptionConfig {
  value: SortOption;
  label: string;
}

const filterOptions: FilterOptionConfig[] = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
];

const sortOptions: SortOptionConfig[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "top", label: "Top Rated" },
];

export default function DashboardPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [publicDecks, setPublicDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sortOption, setSortOption] = useState<SortOption>("trending");
  const [selectedDeck, setSelectedDeck] = useState<DeckResponse | null>(null);
  const router = useRouter();
  const toast = useToast();

  const showToast = () => {
    toast({
      title: "Error",
      description: "Failed to load data. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const myDecks: DeckResponse[] = await fetchApi("/deck/my-decks", {}, "/personal-vocab");
      const deckCount = myDecks.length;
      const totalCards = myDecks.reduce((sum, deck) => sum + deck.cardCount, 0);
      setStats({ deckCount, totalCards });

      const decks: DeckResponse[] = await fetchApi("/deck/public", {}, "/personal-vocab");
      setPublicDecks(decks);
    } catch (error: any) {
      console.error("Error fetching data:", error.message, {
        status: error.status,
      });
      showToast();
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      if (!authLoading) {
        router.push("/login");
      }
      return;
    }
    fetchData();
  }, [isAuthenticated, authLoading, fetchData, router]);

  // Handle manage cards action
  const handleManageCards = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/cards`);
  };

  // Handle learn action
  const handleLearn = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/learn`);
  };

  // Filter and sort decks
  const filteredDecks = publicDecks
    .filter((deck) => (filter === "all" ? true : deck.tags.includes(filter)))
    .sort((a, b) => {
      if (sortOption === "trending")
        return b.subscriberCount - a.subscriberCount;
      if (sortOption === "newest")
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      if (sortOption === "top")
        return b.averageDifficulty - a.averageDifficulty;
      return 0;
    });

  const statBg = useColorModeValue("white", "gray.800");
  const statBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Community Decks
      </Heading>

      {stats && (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
          <Stat
            bg={statBg}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={statBorderColor}
          >
            <StatLabel>Your Decks</StatLabel>
            <StatNumber>{stats.deckCount}</StatNumber>
          </Stat>
          <Stat
            bg={statBg}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor={statBorderColor}
          >
            <StatLabel>Total Cards</StatLabel>
            <StatNumber>{stats.totalCards}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      <FilterControls
        filter={filter}
        setFilter={setFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      ) : filteredDecks.length > 0 ? (
        <Flex wrap="wrap" justify="flex-start" gap={6} mt={6}>
          {filteredDecks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onClick={() => setSelectedDeck(deck)}
              aria-label={`View details for ${deck.title}`}
            />
          ))}
        </Flex>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.600">
            No public decks match your filter.
          </Text>
        </Box>
      )}

      {selectedDeck && (
        <DeckDetailsModal
          deck={selectedDeck}
          isOpen={!!selectedDeck}
          onClose={() => setSelectedDeck(null)}
          userId={user?.id || ""}
          onManageCards={
            selectedDeck.ownerId === user?.id ? handleManageCards : undefined
          }
          onLearn={
            selectedDeck.ownerId === user?.id ? handleLearn : undefined
          }
        />
      )}
    </Box>
  );
}
