"use client";

import { useState } from "react";
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
  Image,
  Tag,
  TagLabel,
  Box,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from "@chakra-ui/react";
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
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const handleGenerate = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Generate with this model is not yet implemented.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubscribe = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Subscribe functionality is not yet implemented.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFollow = () => {
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        bg="gray.900"
        color="white"
        borderRadius="lg"
        border="2px solid"
        borderColor="red.500"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "lg",
          border: "1px solid",
          borderColor: "orange.500",
          opacity: 0.3,
        }}
      >
        <ModalHeader>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Avatar
                name={deck.authorNickname || "Unknown"}
                size="sm"
                bg="red.500"
                color="white"
              />
              <Text fontSize="sm" fontWeight="bold">
                {deck.authorNickname || "Unknown"}
              </Text>
              {!isOwner && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="orange.500"
                    color="orange.500"
                    _hover={{ bg: "orange.500", color: "gray.900" }}
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="red.500"
                    color="red.500"
                    _hover={{ bg: "red.500", color: "gray.900" }}
                    onClick={handleSubscribe}
                  >
                    {deck.isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </Button>
                </>
              )}
            </HStack>
          </HStack>
          <Text
            fontSize="2xl"
            mt={2}
            fontWeight="extrabold"
            color="orange.500"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {deck.title}
          </Text>
        </ModalHeader>
        <ModalCloseButton color="gray.400" _hover={{ color: "red.500" }} />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Deck Image */}
            {deck.imageUrl ? (
              <Image
                src={deck.imageUrl}
                alt={`${deck.title} image`}
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
                border="1px solid"
                borderColor="red.500"
              />
            ) : (
              <Box
                bg="gray.800"
                borderRadius="md"
                h="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderColor="red.500"
              >
                <Text color="gray.400">No Image Available</Text>
              </Box>
            )}

            {/* Deck Stats */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
              <Stat>
                <StatLabel color="gray.400">Cards</StatLabel>
                <StatNumber color="white">{deck.cardCount ?? "N/A"}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Subscribers</StatLabel>
                <StatNumber color="white">
                  {deck.subscriberCount ?? "N/A"}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.400">Difficulty</StatLabel>
                <StatNumber color="white">
                  {deck.averageDifficulty
                    ? deck.averageDifficulty.toFixed(1)
                    : "N/A"}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Description */}
            <VStack align="start" spacing={2}>
              <Text fontSize="md" fontWeight="bold" color="red.500">
                Description
              </Text>
              <Text color="gray.300">{deck.description || "No description available"}</Text>
            </VStack>

            {/* Tags */}
            {deck.tags && deck.tags.length > 0 && (
              <VStack align="start" spacing={2}>
                <Text fontSize="md" fontWeight="bold" color="red.500">
                  Tags
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {deck.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="sm"
                      variant="solid"
                      bg="orange.500"
                      color="gray.900"
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            )}

            {/* Created Date */}
            <Text fontSize="sm" color="gray.400">
              Created: {new Date(deck.createdDate).toLocaleString()}
            </Text>

            {/* AI Features Toggle */}
            <Button
              onClick={() => setShowAIFeatures(!showAIFeatures)}
              variant="outline"
              borderColor="red.500"
              color="red.500"
              _hover={{ bg: "red.500", color: "gray.900" }}
              size="md"
              mb={2}
            >
              {showAIFeatures ? "Hide AI Features" : "Show AI Features"}
            </Button>

            {/* AI Features Section */}
            {showAIFeatures && (
              <VStack spacing={4} align="stretch" border="1px dashed" borderColor="orange.500" p={4} borderRadius="md">
                <VStack align="start">
                  <Text fontSize="md" fontWeight="bold" color="orange.500">
                    Prompt Details
                  </Text>
                  <Textarea
                    value={deck.description || "No description available"}
                    isDisabled
                    resize="none"
                    bg="gray.800"
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
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack spacing={3} width="100%">
            {showAIFeatures && (
              <Button
                width="100%"
                bgGradient="linear(to-r, red.500, orange.500)"
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={handleGenerate}
              >
                Generate with this Model
              </Button>
            )}
            <HStack spacing={2} justify="center" width="100%">
              {onEdit && isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="orange.500"
                  color="orange.500"
                  _hover={{ bg: "orange.500", color: "gray.900" }}
                  onClick={() => onEdit(deck.id)}
                >
                  Edit Deck
                </Button>
              )}
              {onDelete && isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="red.500"
                  color="red.500"
                  _hover={{ bg: "red.500", color: "gray.900" }}
                  onClick={() => onDelete(deck.id)}
                >
                  Delete Deck
                </Button>
              )}
              {onManageCards && isOwner && (
                <Button
                  size="sm"
                  bg="orange.500"
                  color="gray.900"
                  _hover={{ bg: "orange.600" }}
                  onClick={() => onManageCards(deck.id)}
                >
                  Manage Cards
                </Button>
              )}
              {onLearn && isOwner && (
                <Button
                  size="sm"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: "red.600" }}
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