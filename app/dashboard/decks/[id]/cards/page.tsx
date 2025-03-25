"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Select,
  Text as ChakraText, // Alias to avoid collision with DOM Text
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useApi } from "@/app/lib/api";

interface Card {
  id: string;
  front: string;
  back: string;
  skill: "Reading" | "Writing" | "Speaking" | "Listening";
}

export default function DeckCards() {
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    skill: "Reading" as const,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading) {
      fetchCards();
    }
  }, [isAuthenticated, loading, id, router]);

  const fetchCards = async () => {
    try {
      const data = await api.get<Card[]>(`/cards/deck/${id}`);
      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const card = await api.post<Card>("/cards", { ...newCard, deckId: id });
      setCards([...cards, card]);
      setNewCard({ front: "", back: "", skill: "Reading" });
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  if (loading) return <Box>Loading...</Box>;

  return (
    <Box p={6}>
      <Heading mb={4}>Edit Cards</Heading>
      <form onSubmit={handleAddCard}>
        <VStack spacing={4} mb={6}>
          <FormControl isRequired>
            <FormLabel>Front</FormLabel>
            <Input
              value={newCard.front}
              onChange={(e) =>
                setNewCard({ ...newCard, front: e.target.value })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Back</FormLabel>
            <Input
              value={newCard.back}
              onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Skill</FormLabel>
            <Select
              value={newCard.skill}
              onChange={(e) =>
                setNewCard({ ...newCard, skill: e.target.value as any })
              }
            >
              <option value="Reading">Reading</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
              <option value="Listening">Listening</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Add Card
          </Button>
        </VStack>
      </form>
      <VStack spacing={4}>
        {cards.map((card) => (
          <HStack
            key={card.id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            w="full"
          >
            <VStack align="start" flex={1}>
              <ChakraText>Front: {card.front}</ChakraText>
              <ChakraText>Back: {card.back}</ChakraText>
            </VStack>
            <Badge>{card.skill}</Badge>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
