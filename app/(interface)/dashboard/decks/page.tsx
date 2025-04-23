"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  IconButton,
  Select,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

export default function MyDecksPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<DeckResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "owned" | "subscribed">("all");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchDecks = async () => {
      try {
        const myDecks: DeckResponse[] = await fetchApi("/deck/my-decks");
        setDecks(myDecks);
      } catch (error: any) {
        console.error("Error fetching decks:", error.message, {
          status: error.status,
        });
        toast({
          title: "Error",
          description: "Failed to load decks.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [isAuthenticated, authLoading, toast]);

  const handleDeckClick = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}`);
  };

  const handleEdit = (deckId: string) => {
    router.push(`/dashboard/decks/${deckId}/edit`); // Assumes an edit page
  };

  const handleDelete = async (deckId: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;

    try {
      await fetchApi(`/deck/${deckId}`, { method: "DELETE" });
      setDecks(decks.filter((deck) => deck.id !== deckId));
      toast({
        title: "Success",
        description: "Deck deleted.",
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
        description: "Failed to delete deck.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredDecks = decks.filter((deck) => {
    if (filter === "owned") return deck.ownerId === user?.id;
    if (filter === "subscribed") return deck.isSubscribed;
    return true; // "all"
  });

  if (authLoading || !isAuthenticated) return null;
  if (loading) return <Text>Loading decks...</Text>;

  return (
    <Box p={6}>
      <Heading size="lg">My Decks, {user?.userName}</Heading>
      <HStack mt={4} spacing={4}>
        <Select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "owned" | "subscribed")
          }
          width="200px"
        >
          <option value="all">All Decks</option>
          <option value="owned">Owned Decks</option>
          <option value="subscribed">Subscribed Decks</option>
        </Select>
        <Button
          colorScheme="teal"
          onClick={() => router.push("/dashboard/decks/new")}
        >
          Create New Deck
        </Button>
      </HStack>
      {filteredDecks.length > 0 ? (
        <Wrap mt={4} spacing={4} align="stretch">
          {filteredDecks.map((deck) => (
            <Box
              key={deck.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <HStack justify="space-between">
                <Box
                  onClick={() => handleDeckClick(deck.id)}
                  cursor="pointer"
                  flex="1"
                >
                  <Text fontSize="xl" fontWeight="bold">
                    {deck.title}
                  </Text>
                  <Text>{deck.description || "No description"}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Cards: {deck.cardCount ?? "N/A"} • Created:{" "}
                    {new Date(deck.createdDate).toLocaleDateString()}
                  </Text>
                </Box>
                {deck.ownerId === user?.id && (
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit deck"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEdit(deck.id)}
                    />
                    <IconButton
                      aria-label="Delete deck"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(deck.id)}
                    />
                  </HStack>
                )}
              </HStack>
            </Box>
          ))}
        </Wrap>
      ) : (
        <Box mt={4}>
          <Text>No decks match your filter.</Text>
          <Button
            mt={2}
            colorScheme="teal"
            onClick={() => router.push("/dashboard/decks/new")}
          >
            Create Your First Deck
          </Button>
        </Box>
      )}
    </Box>
  );
}
