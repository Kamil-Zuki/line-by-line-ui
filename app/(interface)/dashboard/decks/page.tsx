//app\(interface)\dashboard\decks\page.tsx
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
  VStack,
  CloseButton,
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

  // Custom toast renderer for Spider-Man style
  const showToast = (title: string, description: string, status: "success" | "error") => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          bg="black"
          border="2px solid"
          borderColor={status === "success" ? "blue.500" : "red.500"}
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 10px rgba(255, 215, 0, 0.5)" // Yellow glow for Spidey
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.900" }}
        >
          <VStack align="start" spacing={1}>
            <Heading as="h3" size="sm" color="white">
              {title}
            </Heading>
            <Text fontSize="sm">{description}</Text>
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
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

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      if (!authLoading) {
        router.push("/auth/login");
      }
      return;
    }
    fetchDecks();
  }, [isAuthenticated, authLoading, fetchDecks, router]);

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

  // Handle create new deck
  const handleCreateDeck = () => {
    router.push("/dashboard/decks/new");
  };

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
        right: "10%",
        width: "100px",
        height: "2px",
        bg: "white",
        transform: "rotate(45deg)",
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
          mb={4}
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 215, 0, 0.5)" // Yellow glow for Spidey
        >
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
            filter={filter}
            setFilter={setFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
          />
          <Button
            bg="red.500"
            border="2px solid"
            borderColor="blue.500"
            color="white"
            onClick={handleCreateDeck}
            size="md"
            minW="150px"
            _hover={{
              bg: "red.600",
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
            }}
            _active={{ bg: "red.700" }}
          >
            Create New Deck
          </Button>
        </Flex>

        {isLoading ? (
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
            <Text
              fontSize="lg"
              color="gray.400"
              fontWeight="bold"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
              mb={4}
            >
              No decks match your filter.
            </Text>
            <Button
              bg="red.500"
              border="2px solid"
              borderColor="blue.500"
              color="white"
              onClick={handleCreateDeck}
              _hover={{
                bg: "red.600",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
              }}
              _active={{ bg: "red.700" }}
            >
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
    </Box>
  );
}