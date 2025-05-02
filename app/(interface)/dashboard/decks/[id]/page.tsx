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

  // Custom toast renderer for Ultimate Spider-Man style
  const showErrorToast = (message: string) => {
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
            <ChakraText fontSize="sm">{message}</ChakraText>
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
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

  if (authLoading || !isAuthenticated) return null;
  if (loading)
    return (
      <ChakraText color="gray.300" textAlign="center">
        Loading deck...
      </ChakraText>
    );
  if (!deck)
    return (
      <ChakraText color="gray.300" textAlign="center">
        Deck not found.
      </ChakraText>
    );

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={{ base: 4, md: 6 }}
      bg="gray.800"
      border="2px solid"
      borderColor="blue.900"
      borderRadius="md"
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
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
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
    >
      <VStack spacing={4} position="relative" zIndex={3} align="stretch">
        <Heading
          size={{ base: "lg", md: "xl" }}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
        >
          {deck.title}
        </Heading>
        <ChakraText color="gray.300">{deck.description || "No description"}</ChakraText>
        <ChakraText fontSize="sm" color="gray.500">
          Cards: {deck.cardCount} • Created:{" "}
          {new Date(deck.createdDate).toLocaleDateString()}
          {deck.isSubscribed ? " • Subscribed" : ""}
        </ChakraText>
        <HStack spacing={4}>
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="blue.900"
            color="white"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            onClick={handleLearn}
          >
            Learn
          </Button>
          {deck.ownerId === user?.id && (
            <Button
              bg="gray.700"
              border="2px solid"
              borderColor="blue.900"
              color="white"
              _hover={{
                bg: "gray.600",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              _active={{ bg: "gray.800" }}
              transition="all 0.2s"
              onClick={() => router.push(`/dashboard/decks/${deckId}/edit`)}
            >
              Edit Deck
            </Button>
          )}
        </HStack>
        <VStack mt={6} spacing={4} align="stretch">
          <Heading
            size="md"
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
          >
            Cards
          </Heading>
          {cards.length > 0 ? (
            cards.map((card) => (
              <Box
                key={card.id}
                p={4}
                bg="gray.700"
                border="2px solid"
                borderColor="blue.900"
                borderRadius="md"
                boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
                _hover={{
                  transform: "scale(1.01)",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                }}
                transition="all 0.2s"
              >
                <ChakraText fontWeight="bold" color="white">
                  {card.front}
                </ChakraText>
                <ChakraText color="gray.300">{card.back}</ChakraText>
                {card.hint && (
                  <ChakraText fontSize="sm" color="gray.500">
                    Hint: {card.hint}
                  </ChakraText>
                )}
                <ChakraText fontSize="sm" color="gray.500">
                  Skill: {card.skill}
                </ChakraText>
              </Box>
            ))
          ) : (
            <ChakraText color="gray.300">No cards in this deck yet.</ChakraText>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}