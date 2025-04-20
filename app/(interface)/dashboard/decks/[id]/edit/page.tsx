"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

export default function EditDeckPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || authLoading || !deckId) return;

    const fetchDeck = async () => {
      try {
        const deckData: DeckResponse = await fetchApi(`/deck/${deckId}`);
        if (deckData.ownerId !== user?.id) {
          toast({
            title: "Error",
            description: "You can only edit your own decks.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push(`/dashboard/decks/${deckId}`);
          return;
        }
        setDeck(deckData);
        setForm({
          title: deckData.title,
          description: deckData.description || "",
          tags: deckData.tags.join(", "),
        });
      } catch (error: any) {
        console.error("Error fetching deck:", error.message, {
          status: error.status,
        });
        toast({
          title: "Error",
          description: "Failed to load deck.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [isAuthenticated, authLoading, deckId, user, toast, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedDeck = {
        title: form.title,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      await fetchApi(`/decks/${deckId}`, {
        method: "PUT",
        body: JSON.stringify(updatedDeck),
      });
      toast({
        title: "Success",
        description: "Deck updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/dashboard/decks/${deckId}`);
    } catch (error: any) {
      console.error("Error updating deck:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description:
          error.status === 405
            ? "Updating decks is not supported yet."
            : "Failed to update deck.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (authLoading || !isAuthenticated) return null;
  if (loading) return <Box>Loading deck...</Box>;
  if (!deck) return <Box>Deck not found or access denied.</Box>;

  return (
    <Box p={6}>
      <Heading size="lg">Edit Deck: {deck.title}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack mt={4} spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter deck title"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter deck description"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g., vocabulary, grammar"
            />
          </FormControl>
          <HStack spacing={4}>
            <Button type="submit" colorScheme="teal">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/decks/${deckId}`)}
            >
              Cancel
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
