"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";

interface Stats {
  deckCount: number;
  totalCards: number;
}

type SortOption = "trending" | "newest" | "top";

interface LanguageOption {
  value: string; // Language filter can remain string for flexibility
  label: string;
}

interface SortOptionConfig {
  value: SortOption; // Explicitly use SortOption
  label: string;
}

export default function DashboardPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [publicDecks, setPublicDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("trending");
  const [selectedDeck, setSelectedDeck] = useState<DeckResponse | null>(null);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchData = async () => {
      try {
        const myDecks: DeckResponse[] = await fetchApi("/deck/my-decks");
        const deckCount = myDecks.length;
        const totalCards = myDecks.reduce(
          (sum, deck) => sum + deck.cardCount,
          0
        );
        setStats({ deckCount, totalCards });

        const decks: DeckResponse[] = await fetchApi("/deck/public");
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
        return b.averageDifficulty - a.averageDifficulty;
      return 0;
    });

  const languageOptions: LanguageOption[] = [
    { value: "all", label: "All Languages" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    // Add more as needed
  ];

  const sortOptions: SortOptionConfig[] = [
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
    { value: "top", label: "Top Rated" },
  ];

  if (authLoading || !isAuthenticated) return null;
  if (loading) return <Text>Loading...</Text>;

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={4}>
        Community Creations
      </Heading>
      <FilterControls
        languageFilter={languageFilter}
        setLanguageFilter={setLanguageFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        languageOptions={languageOptions}
        sortOptions={sortOptions}
      />
      <Flex wrap="wrap" justify="flex-start" gap={6}>
        {filteredDecks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onClick={() => setSelectedDeck(deck)}
          />
        ))}
      </Flex>
      {selectedDeck && (
        <DeckDetailsModal
          deck={selectedDeck}
          isOpen={!!selectedDeck}
          onClose={() => setSelectedDeck(null)}
          userId={user?.id || ""} // Pass user ID
        />
      )}
    </Box>
  );
}
