"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Deck {
  id: string;
  title: string;
  cardCount: number;
}

export default function DecksPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchDecks = async () => {
      try {
        const res = await fetch("/api/personal-vocab/decks", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch decks");
        const data = await res.json();
        setDecks(data);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, status: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [isAuthenticated, tokens.accessToken, router, toast]);

  if (!isAuthenticated) return null;
  if (loading) return <Spinner size="xl" m={8} />;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        My Decks
      </Heading>
      <VStack align="stretch" spacing={4}>
        {decks.length > 0 ? (
          decks.map((deck) => (
            <Box
              key={deck.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", cursor: "pointer" }}
              onClick={() => router.push(`/dashboard/decks/${deck.id}`)}
            >
              <Text fontSize="lg" fontWeight="bold">
                {deck.title}
              </Text>
              <Text color="gray.600">{deck.cardCount} cards</Text>
            </Box>
          ))
        ) : (
          <Text>No decks found. Create one to get started!</Text>
        )}
        <Button
          colorScheme="teal"
          mt={4}
          onClick={() => router.push("/dashboard/decks/new")}
        >
          Create New Deck
        </Button>
      </VStack>
    </Box>
  );
}
