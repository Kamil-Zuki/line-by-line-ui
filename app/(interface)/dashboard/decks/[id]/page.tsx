"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Heading,
  Text as ChakraText,
  VStack,
  Button,
  HStack,
  useToast,
  CloseButton,
  Container,
  Card,
  CardBody,
  Spinner,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { DeckResponse } from "@/app/interfaces";
import { fetchApi } from "@/app/lib/api"

interface CardResponse {
  id: string;
  front: string;
  back: string;
  hint?: string;
  skill: "Reading" | "Writing" | "Speaking" | "Listening";
  createdDate: string;
}

export default function DeckDetailPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;
  const toast = useToast();

  // Custom toast renderer
  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  useEffect(() => {
    if (!isAuthenticated || authLoading || !deckId) return;

    const fetchDeckAndCards = async () => {
      try {
        const deckData: DeckResponse = await fetchApi(`/deck/${deckId}`);
        const cardData: CardResponse[] = await fetchApi(
          `/card/${deckId}/cards`
        );
        setDeck(deckData);
        setCards(cardData);
      } catch (error: any) {
        console.error("Error fetching deck/cards:", error.message, {
          status: error.status,
        });
        showErrorToast("Failed to load deck or cards.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [isAuthenticated, authLoading, deckId]);

  const handleLearn = () => {
    router.push(`/dashboard/decks/${deckId}/learn`);
  };

  const cardBg = useColorModeValue("gray.50", "gray.700");
  const cardBorderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const hintColor = useColorModeValue("gray.500", "gray.500");

  if (authLoading || !isAuthenticated) return null;
  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="xl" thickness="3px" />
      </Flex>
    );
  }
  if (!deck) {
    return (
      <ChakraText textAlign="center" py={10}>
        Deck not found.
      </ChakraText>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size={{ base: "lg", md: "xl" }} textAlign="center">
          {deck.title}
        </Heading>
        <Card>
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <ChakraText>{deck.description || "No description"}</ChakraText>
              <ChakraText fontSize="sm" color={textColor}>
                Cards: {deck.cardCount} • Created:{" "}
                {new Date(deck.createdDate).toLocaleDateString()}
                {deck.isSubscribed ? " • Subscribed" : ""}
              </ChakraText>
              <HStack spacing={4}>
                <Button colorScheme="brand" onClick={handleLearn}>
                  Learn
                </Button>
                {deck.ownerId === user?.id && (
                  <Button variant="outline" onClick={() => router.push(`/dashboard/decks/${deckId}/edit`)}>
                    Edit Deck
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Cards</Heading>
              {cards.length > 0 ? (
                cards.map((card) => (
                  <Box key={card.id} p={4} bg={cardBg} borderRadius="md" borderWidth="1px" borderColor={cardBorderColor}>
                    <ChakraText fontWeight="bold">{card.front}</ChakraText>
                    <ChakraText color={textColor}>{card.back}</ChakraText>
                    {card.hint && (
                      <ChakraText fontSize="sm" color={hintColor}>
                        Hint: {card.hint}
                      </ChakraText>
                    )}
                    <ChakraText fontSize="sm" color={hintColor}>
                      Skill: {card.skill}
                    </ChakraText>
                  </Box>
                ))
              ) : (
                <ChakraText color={textColor}>No cards in this deck yet.</ChakraText>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}