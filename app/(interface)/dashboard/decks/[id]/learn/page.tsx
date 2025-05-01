"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text as ChakraText,
  Button,
  useToast,
  Spinner,
  CloseButton,
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
import { fetchApi, CardDto } from "@/app/lib/api";
import { CardReview } from "@/app/components/ui/CardReview";

// Define session-related types (adjust based on actual API responses)
interface StartSessionResponse {
  sessionId: string;
}

interface SessionDetails {
  id: string;
  startTime: string; // ISO 8601 format
  endTime: string | null; // ISO 8601 format
  reviewedCards: Array<{
    cardId: string;
    quality: number; // 0-5
    reviewedAt: string; // ISO 8601 format, added to match StudySessionCardDto
  }>;
  averageQuality: number;
  totalCardsReviewed: number;
}

export default function LearnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<CardDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
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

  // Fetch due cards on page load
  const fetchDueCards = useCallback(async () => {
    console.log("Fetching due cards for deck:", id);
    try {
      const response = await fetchApi<CardDto[]>(
        `/card/due?deckId=${id}&mode=learn&sortBy=nextReviewDate`
      );
      console.log("Due cards fetched:", response);
      setCards(response);
    } catch (error: any) {
      console.error("Error fetching due cards:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to load due cards. Please try again.", "error");
      router.push(`/dashboard/decks/${id}`);
      throw error;
    }
  }, [id, router]);

  // Initial fetch when page loads
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await fetchDueCards();
      } catch (error) {
        // Error is handled in fetchDueCards (toast and redirect)
      } finally {
        console.log("Setting isLoading to false after initial fetch");
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, authLoading, fetchDueCards]);

  // Start study session
  const startSession = async () => {
    if (cards.length === 0) {
      showToast("Info", "No due cards for this deck.", "success");
      router.push(`/dashboard/decks/${id}`);
      return;
    }

    setIsLoading(true);
    console.log("Starting session for deck:", id);
    try {
      console.log("Calling /study/start");
      const response = await fetchApi<StartSessionResponse>("/study/start", {
        method: "POST",
        body: JSON.stringify({ deckId: id }),
      });
      console.log("Session started:", response);
      setSessionId(response.sessionId);
      setStartTime(new Date());
      setCurrentIndex(0);
    } catch (error: any) {
      console.error("Error starting session:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to start session. Please try again.", "error");
      router.push(`/dashboard/decks/${id}`);
    } finally {
      console.log("Setting isLoading to false after starting session");
      setIsLoading(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (!startTime || sessionDetails) return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, sessionDetails]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle review submission
  const handleReview = async (quality: number) => {
    if (!sessionId) return;

    try {
      await fetchApi(`/card/review/${cards[currentIndex].id}`, {
        method: "POST",
        body: JSON.stringify({ quality }),
      });
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowEndConfirmation(true); // Show confirmation when all cards are reviewed
      }
    } catch (error: any) {
      console.error("Error submitting review:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to submit review. Please try again.", "error");
    }
  };

  // End session
  const endSession = async () => {
    if (!sessionId) return;

    setIsEnding(true);
    try {
      await fetchApi(`/study/end/${sessionId}`, { method: "POST" });
      const details = await fetchApi<SessionDetails>(`/study/${sessionId}`);
      console.log("Fetched session details:", details); // Debug log
      setSessionDetails(details);
    } catch (error: any) {
      console.error("Error ending session:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to end session. Please try again.", "error");
    } finally {
      setIsEnding(false);
      setShowEndConfirmation(false);
    }
  };

  // Calculate average quality score
  const calculateAverageQuality = (details: SessionDetails) => {
    if (!details.reviewedCards || details.reviewedCards.length === 0) return 0;
    const totalQuality = details.reviewedCards.reduce(
      (sum, review) => sum + review.quality,
      0
    );
    return (totalQuality / details.reviewedCards.length).toFixed(2);
  };

  // Authentication and loading states
  if (authLoading) {
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

  if (isLoading) {
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

  // Initial state: Show "Start Session" button
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
                aria-label="Back to deck"
              >
                Back to Deck
              </Button>
            </>
          ) : (
            <>
              <ChakraText color="gray.300" mb={4} textAlign="center">
                Start a study session to review your {cards.length} due card{cards.length !== 1 ? "s" : ""}.
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
                onClick={startSession}
                aria-label="Start study session"
              >
                Start Session
              </Button>
            </>
          )}
        </VStack>
      </Box>
    );
  }

  // Session ended: Show results
  if (sessionDetails) {
    const startTimeFormatted = new Date(sessionDetails.startTime).toLocaleString();
    const endTimeFormatted = sessionDetails.endTime
      ? new Date(sessionDetails.endTime).toLocaleString()
      : "N/A";
    const averageQuality = calculateAverageQuality(sessionDetails);

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
            Session Results
          </Heading>
          <VStack
            spacing={2}
            p={4}
            bg="gray.700"
            border="2px solid"
            borderColor="blue.900"
            borderRadius="md"
            boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          >
            <ChakraText color="white">
              <strong>Start Time:</strong> {startTimeFormatted}
            </ChakraText>
            <ChakraText color="white">
              <strong>End Time:</strong> {endTimeFormatted}
            </ChakraText>
            <ChakraText color="white">
              <strong>Cards Reviewed:</strong>{" "}
              {sessionDetails.totalCardsReviewed}
            </ChakraText>
            <ChakraText color="white">
              <strong>Average Quality Score:</strong> {averageQuality}/5
            </ChakraText>
          </VStack>
          {sessionDetails.reviewedCards.length > 0 && (
            <Box
              p={4}
              bg="gray.700"
              border="2px solid"
              borderColor="blue.900"
              borderRadius="md"
              boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
              overflowX="auto"
            >
              <Heading as="h3" size="md" color="white" mb={4}>
                Reviewed Cards
              </Heading>
              <Table variant="simple" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th color="white">Card ID</Th>
                    <Th color="white">Quality</Th>
                    <Th color="white">Reviewed At</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sessionDetails.reviewedCards.map((review, index) => (
                    <Tr key={index}>
                      <Td color="white">{review.cardId}</Td>
                      <Td color="white">{review.quality}/5</Td>
                      <Td color="white">
                        {new Date(review.reviewedAt).toLocaleString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
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
            aria-label="Back to deck"
          >
            Back to Deck
          </Button>
        </VStack>
      </Box>
    );
  }

  // Active session: Show card review UI
  return (
    <>
      <Box minH="100vh" p={4} display="flex" flexDirection="column">
        <VStack spacing={4} align="stretch" maxW="800px" w="100%" mx="auto" flex={1}>
          <Heading
            as="h1"
            size={{ base: "lg", md: "xl" }}
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
            textAlign="center"
          >
            Learn Deck
          </Heading>

          {/* Timer and Progress Bar */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            bg="gray.700"
            p={3}
            border="2px solid"
            borderColor="blue.900"
            borderRadius="md"
            boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          >
            <ChakraText color="white" fontWeight="bold">
              Time: {formatTime(elapsedTime)}
            </ChakraText>
            <Box flex={1} mx={4}>
              <Progress
                value={(currentIndex / cards.length) * 100}
                size="sm"
                colorScheme="blue"
                bg="gray.600"
                borderRadius="md"
              />
              <ChakraText color="gray.300" fontSize="sm" textAlign="center" mt={1}>
                {currentIndex}/{cards.length} cards reviewed
              </ChakraText>
            </Box>
            <Button
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              color="white"
              size="sm"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                transform: "scale(1.02)",
              }}
              _active={{ bg: "red.900" }}
              transition="all 0.2s"
              onClick={() => setShowEndConfirmation(true)}
              isLoading={isEnding}
              aria-label="End study session"
            >
              End Session
            </Button>
          </Flex>

          <CardReview
            key={cards[currentIndex].id}
            card={cards[currentIndex]}
            onReview={handleReview}
          />
        </VStack>
      </Box>

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={showEndConfirmation}
        onClose={() => setShowEndConfirmation(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
        >
          <ModalHeader color="white">End Study Session</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <ChakraText color="white">
              Are you sure you want to end this study session? Your progress will be saved.
            </ChakraText>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              color="white"
              mr={3}
              onClick={() => setShowEndConfirmation(false)}
              aria-label="Cancel ending session"
            >
              Cancel
            </Button>
            <Button
              bg="red.800"
              border="2px solid"
              borderColor="blue.900"
              color="white"
              _hover={{
                bg: "red.700",
                boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              }}
              _active={{ bg: "red.900" }}
              onClick={endSession}
              isLoading={isEnding}
              aria-label="Confirm end session"
            >
              End Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}