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
  VStack,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { DeckResponse } from "@/app/interfaces";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";
import { fetchApi } from "@/app/lib/api"


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

  // Custom toast renderer for Ultimate Spider-Man style
  const showToast = () => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <Heading as="h3" size="sm" color="white">
              Error
            </Heading>
            <Text fontSize="sm">Failed to load data. Please try again.</Text>
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
    });
  };

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
        background: "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
        opacity: 0.3,
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "-2px",
        left: "10%",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
    >
      <Box
        maxW="1200px"
        mx="auto"
        bg="gray.800"
        p={{ base: 4, md: 6 }}
        border="2px solid"
        borderColor="blue.900"
        boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
        borderRadius="md"
        position="relative"
        zIndex={2}
      >
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          mb={6}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
        >
          Community Creations
        </Heading>

        {stats && (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
            <Stat
              bg="gray.700"
              p={4}
              border="2px solid"
              borderColor="blue.900"
              boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              borderRadius="md"
              _hover={{ transform: "scale(1.01)" }}
              transition="all 0.2s"
            >
              <StatLabel
                color="gray.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="bold"
              >
                Your Decks
              </StatLabel>
              <StatNumber
                color="white"
                fontSize="2xl"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
              >
                {stats.deckCount}
              </StatNumber>
            </Stat>
            <Stat
              bg="gray.700"
              p={4}
              border="2px solid"
              borderColor="blue.900"
              boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              borderRadius="md"
              _hover={{ transform: "scale(1.01)" }}
              transition="all 0.2s"
            >
              <StatLabel
                color="gray.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="bold"
              >
                Total Cards
              </StatLabel>
              <StatNumber
                color="white"
                fontSize="2xl"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
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
              color="white"
              thickness="3px"
              speed="0.65s"
              _hover={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
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
              fontSize="lg"
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