"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text as ChakraText,
  Button,
  useToast,
  Spinner,
  CloseButton,
  VStack,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, CardDto } from "@/app/lib/api";
import { CardReview } from "@/app/components/ui/CardReview";

export default function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<CardDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("nextReviewDate");
  const [skill, setSkill] = useState<string | null>(null);
  const [mode, setMode] = useState<string>("learn");
  const router = useRouter();
  const toast = useToast();

  // Custom toast renderer for Ultimate Spider-Man style
  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
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
              {title}
            </Heading>
            <ChakraText fontSize="sm">{description}</ChakraText>
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
    });
  };

  // Unwrap params using React.use
  const { id } = React.use(params);

  // Fetch due cards
  useEffect(() => {
    const fetchDueCards = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const queryParams = new URLSearchParams({ deckId: id, mode });
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (skill) queryParams.append("skill", skill);

        const response = await fetchApi<CardDto[]>(
          `/card/due?${queryParams.toString()}`
        );
        setCards(response);
      } catch (error: any) {
        console.error("Error fetching due cards:", error.message, {
          status: error.status,
        });
        showToast("Error", "Failed to load due cards. Please try again.", "error");
        router.push(`/dashboard/decks/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchDueCards();
    }
  }, [isAuthenticated, authLoading, id, router, sortBy, skill, mode]);

  // Handle review submission
  const handleReview = async (quality: number) => {
    try {
      await fetchApi(`/card/review/${cards[currentIndex].id}`, {
        method: "POST",
        body: JSON.stringify({ quality }),
      });
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        showToast("Review Complete", "All due cards reviewed!", "success");
        router.push(`/dashboard/decks/${id}`);
      }
    } catch (error: any) {
      console.error("Error submitting review:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to submit review. Please try again.", "error");
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner
          size="xl"
          color="white"
          thickness="3px"
          speed="0.65s"
          _hover={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
        />
      </Box>
    );
  }

  if (cards.length === 0) {
    return (
      <Box maxW="800px" mx="auto" p={{ base: 4, md: 6 }}>
        <VStack spacing={4} align="stretch">
          <Heading
            as="h1"
            size={{ base: "lg", md: "xl" }}
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
            textAlign="center"
          >
            Learn Deck
          </Heading>
          <ChakraText color="gray.300" mb={4} textAlign="center">
            No due cards for this deck.
          </ChakraText>
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
            alignSelf="center"
            onClick={() => router.push(`/dashboard/decks/${id}`)}
          >
            Back to Deck
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={{ base: 4, md: 6 }}>
      <VStack spacing={4} align="stretch">
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
          textAlign="center"
        >
          Learn Deck
        </Heading>

        {/* Controls for sorting, skill, and mode */}
        <Flex gap={4} flexWrap="wrap" justifyContent="center">
          <Select
            w="200px"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            bg="gray.700"
            borderColor="blue.900"
            color="white"
            css={{
              "&": {
                backgroundColor: "#1A202C",
                color: "white",
              },
              "& > option": {
                backgroundColor: "#1A202C",
                color: "white",
              },
            }}
            _focus={{
              borderColor: "blue.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
            }}
          >
            <option value="nextReviewDate">Sort by Next Review Date</option>
            <option value="createdDate">Sort by Created Date</option>
            <option value="easiness">Sort by Easiness</option>
          </Select>

          <Select
            w="200px"
            value={skill || ""}
            onChange={(e) => setSkill(e.target.value || null)}
            bg="gray.700"
            borderColor="blue.900"
            color="white"
            css={{
              "&": {
                backgroundColor: "#1A202C",
                color: "white",
              },
              "& > option": {
                backgroundColor: "#1A202C",
                color: "white",
              },
            }}
            _focus={{
              borderColor: "blue.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
            }}
          >
            <option value="">All Skills</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
            <option value="speaking">Speaking</option>
          </Select>

          <Select
            w="200px"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            bg="gray.700"
            borderColor="blue.900"
            color="white"
            css={{
              "&": {
                backgroundColor: "#1A202C",
                color: "white",
              },
              "& > option": {
                backgroundColor: "#1A202C",
                color: "white",
              },
            }}
            _focus={{
              borderColor: "blue.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
            }}
          >
            <option value="learn">Learn Mode</option>
            <option value="review">Review Mode</option>
          </Select>
        </Flex>

        <CardReview
          key={cards[currentIndex].id} // Add key to force re-mount when card changes
          card={cards[currentIndex]}
          onReview={handleReview}
        />
        <ChakraText color="gray.300" textAlign="center">
          Card {currentIndex + 1} of {cards.length}
        </ChakraText>
      </VStack>
    </Box>
  );
}