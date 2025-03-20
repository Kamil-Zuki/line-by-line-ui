"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";

interface Deck {
  id: string;
  title: string;
  cardCount: number;
}

export default function DeckPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchDeck = async () => {
      try {
        const res = await fetch(`/api/personal-vocab/decks/${id}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch deck");
        const data = await res.json();
        setDeck(data);
        setTitle(data.title);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, status: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [isAuthenticated, tokens.accessToken, id, router, toast]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/personal-vocab/decks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to update deck");
      setDeck({ ...deck!, title });
      toast({
        title: "Success",
        description: "Deck updated",
        status: "success",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/personal-vocab/decks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete deck");
      toast({
        title: "Success",
        description: "Deck deleted",
        status: "success",
      });
      router.push("/dashboard/decks");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) return <Box>Loading...</Box>;
  if (!deck) return <Box>Deck not found</Box>;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        {deck.title}
      </Heading>
      <VStack align="stretch" spacing={4}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={4}
        />
        <Text>{deck.cardCount} cards</Text>
        <Button
          colorScheme="teal"
          onClick={() => router.push(`/dashboard/decks/${id}/cards`)}
        >
          View Cards
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => router.push(`/dashboard/decks/${id}/learn`)}
        >
          Learn
        </Button>
        <Button colorScheme="teal" onClick={handleUpdate} isLoading={loading}>
          Update Deck
        </Button>
        <Button colorScheme="red" onClick={handleDelete} isLoading={loading}>
          Delete Deck
        </Button>
      </VStack>
    </Box>
  );
}
