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
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi } from "@/app/lib/api";
import { DeckCard } from "@/app/components/ui/DeckCard";
import { FilterControls } from "@/app/components/ui/FilterControls";
import { DeckDetailsModal } from "@/app/components/ui/DeckDetailsModal";
import { CardDto, DeckResponse, UserSettingsDto } from "@/app/interfaces";

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
  const [userSettings, setUserSettings] = useState<UserSettingsDto | null>(
    null
  );
  const [decksWithDueCards, setDecksWithDueCards] = useState<number>(0);
  const router = useRouter();
  const toast = useToast();

  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

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
      showToast("Error", "Failed to load decks. Please try again.", "error");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Fetch user settings
  const fetchUserSettings = useCallback(async () => {
    try {
      const settings = await fetchApi<UserSettingsDto>("/settings");
      setUserSettings(settings);
    } catch (error: any) {
      console.error("Error fetching user settings:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to load user settings.", "error");
    }
  }, []);

  // Fetch decks with due cards
  const fetchDecksWithDueCards = useCallback(async () => {
    try {
      let count = 0;
      for (const deck of decks) {
        const response = await fetchApi<{ hasDueCards: boolean }>(
          `/card/due?deckId=${deck.id}&mode=learn`
        );
        if (response.hasDueCards) {
          count++;
        }
      }
      setDecksWithDueCards(count);
    } catch (error: any) {
      console.error("Error fetching due cards:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to load due cards for decks.", "error");
    }
  }, [decks]);

  // Initial data load
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      if (!authLoading) {
        router.push("/auth/login");
      }
      return;
    }
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchDecks(), fetchUserSettings()]);
      } catch (error) {
        console.error("Error during initial data load:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, authLoading, fetchDecks, fetchUserSettings]);

  // Fetch decks with due cards after decks are loaded
  useEffect(() => {
    if (decks.length > 0) {
      fetchDecksWithDueCards();
    }
  }, [decks, fetchDecksWithDueCards]);

  // Calculate total cards
  const totalCards = decks.reduce(
    (sum, deck) => sum + (deck.cardCount || 0),
    0
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
      return a.title.localeCompare(b.title);
    });

  // Handle edit action
  const handleEdit = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/edit`);
  };

  // Handle delete action
  const handleDelete = async (deckId: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;

    try {
      await fetchApi(`/deck/${deckId}`, { method: "DELETE" });
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
      setSelectedDeck(null);
      showToast("Success", "Deck deleted successfully.", "success");
    } catch (error: any) {
      console.error("Error deleting deck:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to delete deck. Please try again.", "error");
    }
  };

  // Handle manage cards action
  const handleManageCards = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/cards`);
  };

  // Handle learn action
  const handleLearn = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/learn`);
  };

  // Handle create new deck
  const handleCreateDeck = () => {
    router.push("/dashboard/decks/new");
  };

  const statsBg = useColorModeValue("white", "gray.800");
  const statsBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        My Decks
      </Heading>

      <Flex
        justify="space-between"
        align={{ base: "stretch", sm: "center" }}
        mb={6}
        direction={{ base: "column", sm: "row" }}
        gap={4}
      >
        <FilterControls
          filter={filter}
          setFilter={setFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
        />
        <Button
          colorScheme="brand"
          onClick={handleCreateDeck}
          size="md"
          minW="150px"
        >
          Create New Deck
        </Button>
      </Flex>

      {/* Informational Panel */}
      <Box
        bg={statsBg}
        borderRadius="lg"
        p={6}
        mb={6}
        boxShadow="sm"
        borderWidth="1px"
        borderColor={statsBorderColor}
      >
        <StatGroup>
          <Stat>
            <StatLabel>Total Decks</StatLabel>
            <StatNumber>{filteredDecks.length}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Cards</StatLabel>
            <StatNumber>{totalCards}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Decks with Due Cards</StatLabel>
            <StatNumber>{decksWithDueCards}</StatNumber>
          </Stat>
          {userSettings && (
            <Stat>
              <StatLabel>Cards Reviewed Today</StatLabel>
              <StatNumber>{userSettings.reviewsCompletedToday}</StatNumber>
            </Stat>
          )}
        </StatGroup>
      </Box>

      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      ) : filteredDecks.length > 0 ? (
        <Flex wrap="wrap" justify="flex-start" gap={6}>
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
          <Text fontSize="lg" color="gray.600" mb={4}>
            No decks match your filter.
          </Text>
          <Button colorScheme="brand" onClick={handleCreateDeck}>
            Create Your First Deck
          </Button>
        </Box>
      )}

      {selectedDeck && (
        <DeckDetailsModal
          deck={selectedDeck}
          isOpen={!!selectedDeck}
          onClose={() => setSelectedDeck(null)}
          userId={user?.id || ""}
          onEdit={selectedDeck.ownerId === user?.id ? handleEdit : undefined}
          onDelete={
            selectedDeck.ownerId === user?.id ? handleDelete : undefined
          }
          onManageCards={
            selectedDeck.ownerId === user?.id ? handleManageCards : undefined
          }
          onLearn={selectedDeck.ownerId === user?.id ? handleLearn : undefined}
        />
      )}
    </Box>
  );
}
