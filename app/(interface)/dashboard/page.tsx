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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";

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

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const myDecks: DeckResponse[] = await fetchApi("/deck/my-decks");
      const deckCount = myDecks.length;
      const totalCards = myDecks.reduce((sum, deck) => sum + deck.cardCount, 0);
      setStats({ deckCount, totalCards });

      const decks: DeckResponse[] = await fetchApi("/deck/public");
      setPublicDecks(decks);
    } catch (error: any) {
      console.error("Error fetching data:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        // bg: "black",
        // border: "2px solid",
        // borderColor: "red.500",
        // color: "white",
        // _hover: { bg: "gray.900" },
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      if (!authLoading) {
        router.push("/auth/login");
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

  return (
    <Box
      minH="100vh"
      p={{ base: 4, md: 8 }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        border: "3px solid",
        borderColor: "red.500",
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)", // Blue glow for Spidey
        zIndex: 1,
        background: "radial-gradient(circle at 5% 5%, transparent 0%, transparent 5%, white 6%, transparent 7%)",
        backgroundSize: "30px 30px",
        opacity: 0.1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "-5px",
        left: "10%",
        width: "100px",
        height: "2px",
        bg: "white",
        transform: "rotate(-45deg)",
        boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
        zIndex: 2,
      }}
    >
      <Box
        maxW="1200px"
        mx="auto"
        bg="black"
        p={{ base: 4, md: 6 }}
        border="2px solid"
        borderColor="red.500"
        boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)"
        borderRadius="md"
        position="relative"
        zIndex={2}
      >
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          mb={6}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 215, 0, 0.5)" // Yellow glow for Spidey
        >
          Community Creations
        </Heading>

        {stats && (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
            <Stat
              bg="gray.900"
              p={4}
              border="2px solid"
              borderColor="blue.500"
              boxShadow="2px 2px 0 rgba(0, 0, 0, 0.8)"
              borderRadius="md"
            >
              <StatLabel
                color="gray.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="extrabold"
              >
                Your Decks
              </StatLabel>
              <StatNumber
                color="white"
                fontSize="2xl"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(255, 215, 0, 0.3)" // Yellow glow
              >
                {stats.deckCount}
              </StatNumber>
            </Stat>
            <Stat
              bg="gray.900"
              p={4}
              border="2px solid"
              borderColor="blue.500"
              boxShadow="2px 2px 0 rgba(0, 0, 0, 0.8)"
              borderRadius="md"
            >
              <StatLabel
                color="gray.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="extrabold"
              >
                Total Cards
              </StatLabel>
              <StatNumber
                color="white"
                fontSize="2xl"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(255, 215, 0, 0.3)" // Yellow glow
              >
                {stats.totalCards}
              </StatNumber>
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
            <Spinner
              size="xl"
              color="red.500"
              thickness="4px"
              speed="0.65s"
              _hover={{ filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7))" }}
            />
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
            <Text
              fontSize="-déck lg"
              color="gray.400"
              fontWeight="bold"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
            >
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
            onLearn={selectedDeck.ownerId === user?.id ? handleLearn : undefined}
          />
        )}
      </Box>
    </Box>
  );
}