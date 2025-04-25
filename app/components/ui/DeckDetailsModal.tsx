import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Image,
  Button,
  HStack,
  Avatar,
  Textarea,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchApi, DeckResponse } from "@/app/lib/api";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

interface DeckDetailsModalProps {
  deck: DeckResponse;
  isOpen: boolean;
  onClose: () => void;
  userId: string; // Current user's ID to check ownership
  onEdit?: (deckId: string) => void; // Optional edit handler
  onDelete?: (deckId: string) => void; // Optional delete handler
}

export function DeckDetailsModal({
  deck,
  isOpen,
  onClose,
  userId,
  onEdit,
  onDelete,
}: DeckDetailsModalProps) {
  const [detailedDeck, setDetailedDeck] = useState<DeckResponse>(deck);
  const [isSubscribed, setIsSubscribed] = useState(deck.isSubscribed);
  const toast = useToast();
  const isOwner = detailedDeck.ownerId === userId;

  useEffect(() => {
    const fetchDeckDetails = async () => {
      try {
        const response: DeckResponse = await fetchApi(`/deck/${deck.id}`);
        setDetailedDeck(response);
        setIsSubscribed(response.isSubscribed);
      } catch (error: any) {
        console.error("Error fetching deck details:", error.message);
        toast({
          title: "Error",
          description: "Failed to load deck details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (isOpen) {
      fetchDeckDetails();
    }
  }, [isOpen, deck.id, toast]);

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await fetchApi(`/deck-subscription/${deck.id}`, { method: "DELETE" });
        setIsSubscribed(false);
        toast({
          title: "Unsubscribed",
          description: `You have unsubscribed from ${detailedDeck.title}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await fetchApi(`/deck-subscription/${deck.id}`, { method: "POST" });
        setIsSubscribed(true);
        toast({
          title: "Subscribed",
          description: `You have subscribed to ${detailedDeck.title}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFork = async () => {
    try {
      await fetchApi(`/decks/${deck.id}/fork`, { method: "POST" });
      toast({
        title: "Deck Forked",
        description: `You have forked ${detailedDeck.title}. It’s now in your gallery.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fork deck.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCopyPrompt = () => {
    if (detailedDeck.generationPrompt) {
      navigator.clipboard.writeText(detailedDeck.generationPrompt);
      toast({
        title: "Prompt Copied",
        description: "The generation prompt has been copied to your clipboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No Prompt",
        description: "No generation prompt available to copy.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "full", md: "lg" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg="gray.800"
        color="white"
        borderRadius={{ base: 0, md: "md" }}
      >
        <ModalHeader>
          <HStack spacing={4}>
            <Avatar
              size="md"
              name={detailedDeck.authorNickname || "Unknown"}
              src={detailedDeck.authorAvatar}
              aria-label={`Avatar of ${
                detailedDeck.authorNickname || "Unknown"
              }`}
            />
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {detailedDeck.title}
              </Text>
              <Text fontSize="sm" color="gray.400">
                by {detailedDeck.authorNickname || "Unknown"}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton aria-label="Close modal" />
        <ModalBody>
          {detailedDeck.imageUrl ? (
            <Image
              src={detailedDeck.imageUrl}
              alt={`Image for ${detailedDeck.title}`}
              borderRadius="md"
              mb={4}
              h={{ base: "150px", md: "200px" }}
              w="100%"
              objectFit="cover"
            />
          ) : (
            <Box
              bg="gray.700"
              h={{ base: "150px", md: "200px" }}
              borderRadius="md"
              mb={4}
              aria-hidden="true"
            />
          )}
          <Text mb={4} fontSize="md">
            {detailedDeck.description || "No description available."}
          </Text>
          <HStack mb={4} spacing={4}>
            <Text fontSize="sm">
              Created: {new Date(detailedDeck.createdDate).toLocaleDateString()}
            </Text>
            <Text fontSize="sm">Cards: {detailedDeck.cardCount}</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            Prompt Details
          </Text>
          <HStack mb={4}>
            <Textarea
              value={detailedDeck.generationPrompt || "No prompt available."}
              isReadOnly
              bg="gray.700"
              color="white"
              border="none"
              resize="none"
              h="100px"
              aria-label="Generation prompt"
            />
            <IconButton
              aria-label="Copy prompt to clipboard"
              icon={<FaCopy />}
              onClick={handleCopyPrompt}
              colorScheme="blue"
              size="md"
            />
          </HStack>
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            LLM Model
          </Text>
          <Text mb={4}>{detailedDeck.llmModel || "Unknown Model"}</Text>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            {isOwner ? (
              <>
                {onEdit && (
                  <IconButton
                    aria-label="Edit deck"
                    icon={<EditIcon />}
                    onClick={() => onEdit(detailedDeck.id)}
                    colorScheme="teal"
                    size="md"
                  />
                )}
                {onDelete && (
                  <IconButton
                    aria-label="Delete deck"
                    icon={<DeleteIcon />}
                    onClick={() => onDelete(detailedDeck.id)}
                    colorScheme="red"
                    size="md"
                  />
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={handleSubscribe}
                  colorScheme={isSubscribed ? "red" : "purple"}
                  variant="outline"
                  size="md"
                >
                  {isSubscribed ? "Unfollow" : "Follow"}
                </Button>
                <Button
                  onClick={handleFork}
                  bgGradient="linear(to-r, #F5546A, #558AFE)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  size="md"
                >
                  Fork Deck
                </Button>
              </>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
