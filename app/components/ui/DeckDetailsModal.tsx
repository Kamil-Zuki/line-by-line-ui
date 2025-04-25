"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  HStack,
  VStack,
  Textarea,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { DeckResponse } from "@/app/lib/api";

interface DeckDetailsModalProps {
  deck: DeckResponse;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onEdit?: (deckId: string) => void;
  onDelete?: (deckId: string) => void;
  onManageCards?: (deckId: string) => void;
  onLearn?: (deckId: string) => void;
}

export function DeckDetailsModal({
  deck,
  isOpen,
  onClose,
  userId,
  onEdit,
  onDelete,
  onManageCards,
  onLearn,
}: DeckDetailsModalProps) {
  const toast = useToast();

  const handleGenerate = () => {
    // Placeholder for generate functionality
    toast({
      title: "Feature Coming Soon",
      description: "Generate with this model is not yet implemented.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubscribe = () => {
    // Placeholder for subscribe functionality
    toast({
      title: "Feature Coming Soon",
      description: "Subscribe functionality is not yet implemented.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFollow = () => {
    // Placeholder for follow functionality
    toast({
      title: "Feature Coming Soon",
      description: "Follow functionality is not yet implemented.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const isOwner = deck.ownerId === userId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white" borderRadius="lg">
        <ModalHeader>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Avatar
                name={deck.authorNickname || "Unknown"}
                size="sm"
                bg="purple.500"
              />
              <Text fontSize="sm">{deck.authorNickname || "Unknown"}</Text>
              {!isOwner && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="purple"
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="teal"
                    onClick={handleSubscribe}
                  >
                    Subscribe
                  </Button>
                </>
              )}
            </HStack>
          </HStack>
          <Text fontSize="xl" mt={2}>
            {deck.title}
          </Text>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <VStack align="start">
              <Text fontSize="sm" color="gray.400">
                Prompt details
              </Text>
              <Textarea
                value={deck.description || "No description available"}
                isDisabled
                resize="none"
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                minH="100px"
              />
            </VStack>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderColor="gray.600"
                color="white"
                _hover={{ bg: "gray.700" }}
              >
                LLM Model
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="gray.600"
                color="white"
                _hover={{ bg: "gray.700" }}
              >
                LLM Model
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="gray.600"
                color="white"
                _hover={{ bg: "gray.700" }}
              >
                LLM Model
              </Button>
            </HStack>
            <Text fontSize="sm" color="gray.400">
              Created: {new Date(deck.createdDate).toLocaleString()}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack spacing={3} width="100%">
            {isOwner && (
              <>
                <Button
                  width="100%"
                  bgGradient="linear(to-r, pink.500, purple.500, blue.500)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  onClick={handleGenerate}
                >
                  Generate with this Model
                </Button>
              </>
            )}

            <HStack spacing={2} justify="center" width="100%">
              {onEdit && isOwner && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => onEdit(deck.id)}
                >
                  Edit Deck
                </Button>
              )}
              {onDelete && isOwner && (
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => onDelete(deck.id)}
                >
                  Delete Deck
                </Button>
              )}
              {onManageCards && isOwner && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => onManageCards(deck.id)}
                >
                  Manage Cards
                </Button>
              )}
              {onLearn && isOwner && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => onLearn(deck.id)}
                >
                  Learn
                </Button>
              )}
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
