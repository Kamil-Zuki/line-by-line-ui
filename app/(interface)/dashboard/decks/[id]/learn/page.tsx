"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text as ChakraText,
  Button,
  useToast,
  Spinner,
  VStack,
  Flex,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  CardDto,
  ReviewResponseDto,
  StudySessionDto,
  StartSessionResponse,
  UserSettingsDto,
  CardStatsDto,
} from "@/app/interfaces";
import { CardReview } from "@/app/components/ui/CardReview";
import { fetchApi } from "@/app/lib/api";
export default function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [deckId, setDeckId] = useState<string | null>(null);
  const [hasDueCards, setHasDueCards] = useState<boolean | null>(null);
  const [currentCard, setCurrentCard] = useState<CardDto | null>(null);
  const [cardHistory, setCardHistory] = useState<CardDto[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<StudySessionDto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettingsDto | null>(
    null
  );
  const [hasCompletedCards, setHasCompletedCards] = useState(false);
  const [stats, setStats] = useState<CardStatsDto | null>(null);


  // Resolve deckId from params
  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setDeckId(id);
    };
    resolveParams();
  }, [params]);

  // Custom toast renderer
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
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
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
          <Button size="sm" variant="ghost" color="white" onClick={onClose}>
            Close
          </Button>
        </Box>
      ),
    });
  };

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

  // Check for due cards
  const fetchDueCards = useCallback(async () => {
    if (!deckId) return;
    try {
      const response = await fetchApi<{ hasDueCards: boolean }>(
        `/card/due?deckId=${deckId}&mode=learn&sortBy=nextReviewDate`
      );
      setHasDueCards(response.hasDueCards);
    } catch (error: any) {
      console.error("Error checking due cards:", error.message, {
        status: error.status,
      });
      showToast(
        "Error",
        "Failed to check due cards. Please try again.",
        "error"
      );
      router.push(`/dashboard/decks/${deckId}`);
    }
  }, [deckId, router]);

  // Fetch session stats
  const fetchSessionStats = useCallback(async () => {
    if (!sessionId) return;
    try {
      const stats = await fetchApi<CardStatsDto>(`/study/${sessionId}/stats`);
      setStats(stats);
    } catch (error: any) {
      console.error("Error fetching session stats:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to load session stats.", "error");
    }
  }, [sessionId]);

  // Start a study session and fetch the first card
  const startSession = useCallback(async () => {
    if (!deckId || !hasDueCards) return;
    setIsStartingSession(true);
    try {
      const response = await fetchApi<StartSessionResponse>("/study/start", {
        method: "POST",
        body: JSON.stringify({ deckId }),
      });
      setSessionId(response.sessionId);
      setHasCompletedCards(false);

      await fetchSessionStats();
      const firstCard = await fetchApi<CardDto>(
        `/card/next/${response.sessionId}`
      );

      if (firstCard) {
        setCurrentCard(firstCard);
        setCardHistory([firstCard]);
      } else {
        setHasCompletedCards(true);
      }
      showToast("Success", "Study session started!", "success");
    } catch (error: any) {
      console.error("Error starting session:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to start session. Please try again.", "error");
      router.push(`/dashboard/decks/${deckId}`);
    } finally {
      setIsStartingSession(false);
    }
  }, [deckId, hasDueCards, router, fetchSessionStats]);

  // Handle card review and fetch next card
  const handleReview = useCallback(
    async (quality: number) => {
      if (!sessionId || !deckId || !currentCard) return;
      try {
        await fetchApi<ReviewResponseDto>(`/card/review/${currentCard.id}`, {
          method: "POST",
          body: JSON.stringify({ quality }),
        });
        await fetchSessionStats();
        const nextCard = await fetchApi<any>(`/card/next/${sessionId}`);
        console.log("Next card", nextCard)

        const isCardDto = nextCard && typeof nextCard === "object" && "id" in nextCard;
        const isStatus204 = nextCard && typeof nextCard === "object" && nextCard.status === 204;
        console.log(isStatus204)
        if (isCardDto) {
          setCurrentCard(nextCard);
          setCardHistory((prev) => [...prev, nextCard]);
        } else if(isStatus204) {
          setHasCompletedCards(true)
        }
         else {
          setHasCompletedCards(true);
        }
      } catch (error: any) {
        if (error.status === 404) {
          setHasCompletedCards(true);
        } else {
          console.error("Error submitting review:", error.message, {
            status: error.status,
          });
          showToast(
            "Error",
            "Failed to submit review. Please try again.",
            "error"
          );
        }
      }
    },
    [sessionId, deckId, currentCard, fetchSessionStats]
  );

  // Initial data load
  useEffect(() => {
    if (!isAuthenticated || authLoading || !deckId) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUserSettings(), fetchDueCards()]);
      } catch (error) {
        console.error("Error during initial data load:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, authLoading, deckId, fetchUserSettings, fetchDueCards]);

  // Debug state transitions
  useEffect(() => {
    console.log(
      "State Update - sessionId:",
      sessionId,
      "sessionDetails:",
      sessionDetails,
      "currentCard:",
      currentCard,
      "stats:",
      stats
    );
  }, [sessionId, sessionDetails, currentCard, stats]);

  // Authentication and loading states
  if (authLoading || isLoading || !deckId) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" color="white" thickness="3px" speed="0.65s" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    showToast("Error", "Please log in to access this page.", "error");
    router.push("/login");
    return null;
  }

  // Initial state: Start session or no cards
  if (!sessionId && !sessionDetails) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <VStack spacing={4} align="stretch" maxW="800px" w="100%">
          <Heading
            as="h1"
            size={{ base: "lg", md: "xl" }}
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
            textAlign="center"
          >
            Learn Deck
          </Heading>
          {hasDueCards === false ||
          (userSettings &&
            userSettings.newCardsCompletedToday >=
              userSettings.dailyNewCardLimit) ? (
            <>
              <ChakraText color="gray.300" mb={4} textAlign="center">
                {userSettings &&
                userSettings.newCardsCompletedToday >=
                  userSettings.dailyNewCardLimit
                  ? "You’ve reached your daily new card limit. Adjust your settings to learn more cards."
                  : "No due cards for this deck."}
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
                onClick={() => router.push(`/dashboard/decks/${deckId}`)}
              >
                Back to Deck
              </Button>
            </>
          ) : hasDueCards === true ? (
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
              isLoading={isStartingSession}
              onClick={startSession}
            >
              Start Learning
            </Button>
          ) : null}
        </VStack>
      </Box>
    );
  }

  // Session active: Show card review or completion
  if (sessionId && !sessionDetails) {
    const totalRemaining = stats
      ? stats.newCount + stats.reviewCount + stats.learningCount
      : 0;
    const totalReviewed =
      cardHistory.length - (currentCard && !hasCompletedCards ? 1 : 0);
    const totalCards = totalReviewed + totalRemaining;
    const progress = totalCards > 0 ? (totalReviewed / totalCards) * 100 : 0;

    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <VStack spacing={4} align="center" maxW="800px" w="100%">
          <Flex justify="space-between" align="center">
            <Heading
              as="h1"
              size={{ base: "lg", md: "xl" }}
              color="white"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
            >
              {hasCompletedCards
                ? "All Cards Reviewed!"
                : `Card ${cardHistory.length} of ${totalCards || "Loading..."}`}
            </Heading>
          </Flex>
          {stats && (
            <ChakraText color="gray.300" fontSize="md">
              New: {stats.newCount} | Review: {stats.reviewCount} | Learning:{" "}
              {stats.learningCount}
            </ChakraText>
          )}
          {!hasCompletedCards && currentCard && (
            <>
              <Progress
                value={progress}
                size="sm"
                colorScheme="blue"
                bg="gray.600"
                borderRadius="md"
              />
              <CardReview
                key={currentCard.id}
                card={currentCard}
                onReview={handleReview}
                imageSize="500px"
              />
            </>
          )}
          {hasCompletedCards && (
            <VStack spacing={4}>
              <ChakraText color="gray.300" fontSize="lg" textAlign="center">
                You’ve reviewed all cards in this session!
              </ChakraText>
            </VStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Session ended: Show summary
  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Modal
        isOpen={!!sessionDetails}
        onClose={() => router.push(`/dashboard/decks/${deckId}`)}
        isCentered
        size={{ base: "full", md: "xl" }}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.700"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          borderRadius="md"
        >
          <ModalHeader
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
            textAlign="center"
          >
            Session Summary
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <ChakraText fontSize="lg">
                Total Cards Reviewed: {sessionDetails?.totalCardsReviewed}
              </ChakraText>
              <ChakraText fontSize="lg">
                Average Quality: {sessionDetails?.averageQuality.toFixed(1)} / 5
              </ChakraText>
              <ChakraText fontSize="lg">
                Start Time:{" "}
                {new Date(sessionDetails?.startTime || "").toLocaleString()}
              </ChakraText>
              <ChakraText fontSize="lg">
                End Time:{" "}
                {new Date(sessionDetails?.endTime || "").toLocaleString()}
              </ChakraText>
              {sessionDetails?.reviewedCards?.length ? (
                <Box overflowX="auto">
                  <Table variant="simple" colorScheme="gray">
                    <Thead>
                      <Tr>
                        <Th color="gray.300">Front</Th>
                        <Th color="gray.300">Back</Th>
                        <Th color="gray.300">Quality</Th>
                        <Th color="gray.300">Reviewed At</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sessionDetails.reviewedCards.map((card, index) => (
                        <Tr key={index}>
                          <Td>{card.front}</Td>
                          <Td>{card.back}</Td>
                          <Td>{card.quality}</Td>
                          <Td>{new Date(card.reviewedAt).toLocaleString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <ChakraText>No cards reviewed in this session.</ChakraText>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
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
              onClick={() => router.push(`/dashboard/decks/${deckId}`)}
            >
              Back to Deck
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
