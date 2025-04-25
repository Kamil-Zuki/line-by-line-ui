"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";

type FilterOption = "all" | "owned" | "subscribed";
type SortOption = "newest" | "title";

interface FilterOptionConfig {
  value: FilterOption;
  label: string;
}

interface SortOptionConfig {
  value: SortOption;
  label: string;
}

const filterOptions: FilterOptionConfig[] = [
  { value: "all", label: "All Decks" },
  { value: "owned", label: "Owned Decks" },
  { value: "subscribed", label: "Subscribed Decks" },
];

const sortOptions: SortOptionConfig[] = [
  { value: "newest", label: "Newest" },
  { value: "title", label: "Title" },
];

export default function MyDecksPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<DeckResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedDeck, setSelectedDeck] = useState<DeckResponse | null>(null);
  const router = useRouter();
  const toast = useToast();

  // Fetch decks
  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    try {
      const myDecks: DeckResponse[] = await fetchApi("/deck/my-decks");
      setDecks(myDecks);
    } catch (error: any) {
      console.error("Error fetching decks:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: "Failed to load decks. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    fetchDecks();
  }, [isAuthenticated, authLoading, fetchDecks]);

  // Handle edit action
  const handleEdit = useCallback(
    (deckId: string) => {
      router.push(`/dashboard/decks/${deckId}/edit`);
    },
    [router]
  );

  // Handle delete action
  const handleDelete = useCallback(
    async (deckId: string) => {
      if (!confirm("Are you sure you want to delete this deck?")) return;

      try {
        await fetchApi(`/deck/${deckId}`, { method: "DELETE" });
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
        setSelectedDeck(null); // Close modal
        toast({
          title: "Success",
          description: "Deck deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error("Error deleting deck:", error.message, {
          status: error.status,
        });
        toast({
          title: "Error",
          description: "Failed to delete deck. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  // Filter and sort decks
  const filteredDecks = decks
    .filter((deck) => {
      if (filter === "owned") return deck.ownerId === user?.id;
      if (filter === "subscribed") return deck.isSubscribed;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      }
      return a.title.localeCompare(b.title); // sortOption === "title"
    });

  // Handle create new deck
  const handleCreateDeck = () => {
    router.push("/dashboard/decks/new");
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
      <Heading as="h1" size="lg" mb={4}>
        My Decks, {user?.userName || "User"}
      </Heading>

      <Flex
        justify="space-between"
        align={{ base: "stretch", sm: "center" }}
        mb={6}
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <FilterControls
          languageFilter={filter}
          setLanguageFilter={(value: string) =>
            setFilter(value as FilterOption)
          }
          sortOption={sortOption}
          setSortOption={(value: string) => setSortOption(value as SortOption)}
          languageOptions={filterOptions}
          sortOptions={sortOptions}
        />
        <Button
          colorScheme="teal"
          onClick={handleCreateDeck}
          size="md"
          minW="150px"
        >
          Create New Deck
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : filteredDecks.length > 0 ? (
        <Flex wrap="wrap" justify="flex-start" gap={6}>
          {filteredDecks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onClick={() => setSelectedDeck(deck)}
            />
          ))}
        </Flex>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" mb={4}>
            No decks match your filter.
          </Text>
          <Button colorScheme="teal" onClick={handleCreateDeck}>
            Create Your First Deck
          </Button>
        </Box>
      )}

      {selectedDeck && (
        <DeckDetailsModal
          deck={selectedDeck}
          isOpen={!!selectedDeck}
          onClose={() => setSelectedDeck(null)}
          userId={user?.id || ""} // Pass user ID
          onEdit={selectedDeck.ownerId === user?.id ? handleEdit : undefined}
          onDelete={
            selectedDeck.ownerId === user?.id ? handleDelete : undefined
          }
        />
      )}
    </Box>
  );
}
