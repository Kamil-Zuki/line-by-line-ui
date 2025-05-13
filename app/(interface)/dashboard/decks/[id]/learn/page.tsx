// app/(interface)/dashboard/decks/[id]/learn/page.tsx
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
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  CardDto,
  ReviewResponseDto,
  StudySessionDto,
  StartSessionResponse,
  UserSettingsDto,
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
  const [cards, setCards] = useState<CardDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
  const [hasCompletedCards, setHasCompletedCards] = useState(false); // Track if all cards are reviewed

  // Resolve deckId from params
  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setDeckId(id);
    };
    resolveParams();
  }, [params]);

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

  // Fetch due cards
  const fetchDueCards = useCallback(async () => {
    if (!deckId) return;
    console.log("Fetching due cards for deck:", deckId);
    try {
      const response = await fetchApi<CardDto[]>(
        `/card/due?deckId=${deckId}&mode=learn&sortBy=nextReviewDate`
      );
      console.log("Due cards fetched:", response);
      setCards(response);
    } catch (error: any) {
      console.error("Error fetching due cards:", error.message, {
        status: error.status,
      });
      showToast(
        "Error",
        "Failed to load due cards. Please try again.",
        "error"
      );
      router.push(`/dashboard/decks/${deckId}`);
      throw error;
    }
  }, [deckId, router]);

  // Start a study session
  const startSession = useCallback(async () => {
    if (!deckId) {
      console.log("startSession: deckId is missing");
      return;
    }
    console.log("startSession: Starting session for deckId:", deckId);
    setIsStartingSession(true);
    try {
      const response = await fetchApi<StartSessionResponse>("/study/start", {
        method: "POST",
        body: JSON.stringify({ deckId }),
      });
      console.log("startSession: API response:", response);
      setSessionId(response.sessionId);
      console.log("startSession: Session ID set to:", response.sessionId);
      setHasCompletedCards(false); // Reset completion state
      setCurrentIndex(0); // Reset to the first card
      showToast("Success", "Study session started!", "success");
    } catch (error: any) {
      console.error("startSession: Error starting session:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to start session. Please try again.", "error");
      router.push(`/dashboard/decks/${deckId}`);
    } finally {
      setIsStartingSession(false);
      console.log("startSession: Finished, isStartingSession set to false");
    }
  }, [deckId, router]);

  // End the study session and fetch session details
  const endSession = useCallback(async () => {
    if (!sessionId || !deckId) return;
    setIsEndingSession(true);
    try {
      const endResponse = await fetchApi<StudySessionDto>(
        `/study/end/${sessionId}`,
        { method: "POST" }
      );
      setSessionDetails(endResponse);
      setSessionId(null); // Reset session
      setHasCompletedCards(false); // Reset completion state
      showToast("Success", "Study session ended!", "success");
    } catch (error: any) {
      console.error("Error ending session:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to end session. Please try again.", "error");
    } finally {
      setIsEndingSession(false);
    }
  }, [sessionId, deckId]);

  // Handle card review
  const handleReview = useCallback(
    async (quality: number) => {
      if (!sessionId || !deckId || currentIndex >= cards.length) return;
      const card = cards[currentIndex];
      try {
        const response = await fetchApi<ReviewResponseDto>(
          `/card/review/${card.id}`,
          {
            method: "POST",
            body: JSON.stringify({ quality, sessionId }),
          }
        );
        showToast(
          "Review Submitted",
          response.feedback.message,
          quality >= 3 ? "success" : "error"
        );

        // Move to the next card or mark as completed
        if (currentIndex + 1 < cards.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setHasCompletedCards(true); // Mark as completed but don't end session
        }
      } catch (error: any) {
        console.error("Error submitting review:", error.message, {
          status: error.status,
        });
        showToast(
          "Error",
          "Failed to submit review. Please try again.",
          "error"
        );
      }
    },
    [sessionId, deckId, currentIndex, cards]
  );

  // Restart card review from the beginning
  const restartCards = useCallback(() => {
    setCurrentIndex(0);
    setHasCompletedCards(false);
    showToast("Success", "Restarted card review!", "success");
  }, []);

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
      sessionDetails
    );
  }, [sessionId, sessionDetails]);

  // Authentication and loading states
  if (authLoading || isLoading || !deckId) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
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

  if (!isAuthenticated) {
    showToast("Error", "Please log in to access this page.", "error");
    router.push("/login");
    return null;
  }

  // Initial state: Show cards to review or "no cards" message
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
          {cards.length === 0 ? (
            <>
              <ChakraText color="gray.300" mb={4} textAlign="center">
                {userSettings &&
                userSettings.newCardsCompletedToday >=
                  userSettings.dailyNewCardLimit ? (
                  <>
                    You’ve reached your daily new card limit.{" "}
                    <Link
                      href="/dashboard/settings"
                      color="blue.300"
                      textDecoration="underline"
                    >
                      Adjust your settings
                    </Link>{" "}
                    to learn more cards.
                  </>
                ) : (
                  "No due cards for this deck."
                )}
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
          ) : (
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
              onClick={() => {
                console.log("Start Learning button clicked");
                startSession();
              }}
            >
              Start Learning ({cards.length} cards)
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  // Session active: Show card review or completion message
  if (sessionId && !sessionDetails) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
      >
        <VStack spacing={4} align="stretch" maxW="800px" w="100%">
          <Flex justify="space-between" align="center">
            <Heading
              as="h1"
              size={{ base: "lg", md: "xl" }}
              color="white"
              textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
            >
              {hasCompletedCards
                ? "All Cards Reviewed!"
                : `Card ${currentIndex + 1} of ${cards.length}`}
            </Heading>
            <Button
              bg="gray.600"
              color="white"
              _hover={{ bg: "gray.500" }}
              onClick={endSession}
              isLoading={isEndingSession}
            >
              End Session
            </Button>
          </Flex>
          {!hasCompletedCards && (
            <>
              <Progress
                value={(currentIndex / cards.length) * 100}
                size="sm"
                colorScheme="blue"
                bg="gray.600"
                borderRadius="md"
              />
              <CardReview
                key={cards[currentIndex].id}
                card={cards[currentIndex]}
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
              <Button
                bg="blue.800"
                border="2px solid"
                borderColor="blue.900"
                color="white"
                _hover={{
                  bg: "blue.700",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                  transform: "scale(1.02)",
                }}
                _active={{ bg: "blue.900" }}
                transition="all 0.2s"
                onClick={restartCards}
              >
                Restart Cards
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Session ended: Show session stats
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
