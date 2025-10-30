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
  useColorModeValue,
} from "@chakra-ui/react";
import { DeckResponse } from "@/app/interfaces";

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

  const statBg = useColorModeValue("gray.50", "gray.700");
  const noImageBg = useColorModeValue("gray.100", "gray.700");
  const noImageColor = useColorModeValue("gray.500", "gray.400");
  const descColor = useColorModeValue("gray.600", "gray.400");
  const dateColor = useColorModeValue("gray.500", "gray.500");
  const aiBorderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3} mb={2}>
            <Avatar
              name={deck.authorNickname || "Unknown"}
              size="sm"
            />
            <Text fontSize="sm" fontWeight="medium">
              {deck.authorNickname || "Unknown"}
            </Text>
            {!isOwner && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={handleFollow}
                >
                  Follow
                </Button>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={handleSubscribe}
                >
                  {deck.isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </>
            )}
          </HStack>
          <Text fontSize="2xl" fontWeight="bold">
            {deck.title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Deck Image */}
            {deck.imageUrl ? (
              <Image
                src={deck.imageUrl}
                alt={`${deck.title} image`}
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
            ) : (
              <Box
                bg={noImageBg}
                borderRadius="md"
                h="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color={noImageColor}>
                  No Image Available
                </Text>
              </Box>
            )}

            {/* Deck Stats */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
              <Stat bg={statBg} p={4} borderRadius="md">
                <StatLabel>Cards</StatLabel>
                <StatNumber>{deck.cardCount ?? "N/A"}</StatNumber>
              </Stat>
              <Stat bg={statBg} p={4} borderRadius="md">
                <StatLabel>Subscribers</StatLabel>
                <StatNumber>{deck.subscriberCount ?? "N/A"}</StatNumber>
              </Stat>
              <Stat bg={statBg} p={4} borderRadius="md">
                <StatLabel>Difficulty</StatLabel>
                <StatNumber>
                  {deck.averageDifficulty ? deck.averageDifficulty.toFixed(1) : "N/A"}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Description */}
            <VStack align="start" spacing={2}>
              <Text fontSize="md" fontWeight="semibold">
                Description
              </Text>
              <Text color={descColor} fontSize="sm">{deck.description || "No description available"}</Text>
            </VStack>

            {/* Tags */}
            {deck.tags && deck.tags.length > 0 && (
              <VStack align="start" spacing={2}>
                <Text fontSize="md" fontWeight="semibold">
                  Tags
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {deck.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="md"
                      colorScheme="brand"
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            )}

            {/* Created Date */}
            <Text fontSize="sm" color={dateColor}>
              Created: {new Date(deck.createdDate).toLocaleString()}
            </Text>

            {/* AI Features Toggle */}
            <Button
              onClick={() => setShowAIFeatures(!showAIFeatures)}
              variant="outline"
              colorScheme="green"
              size="sm"
            >
              {showAIFeatures ? "Hide AI Features" : "Show AI Features"}
            </Button>

            {/* AI Features Section */}
            {showAIFeatures && (
              <VStack spacing={4} align="stretch" borderWidth="1px" borderColor={aiBorderColor} p={4} borderRadius="md">
                <VStack align="start">
                  <Text fontSize="md" fontWeight="semibold">
                    Prompt Details
                  </Text>
                  <Textarea
                    value={deck.description || "No description available"}
                    isDisabled
                    resize="none"
                    minH="100px"
                  />
                </VStack>
                <HStack spacing={2} flexWrap="wrap">
                  <Button size="sm" variant="outline">
                    LLM Model
                  </Button>
                  <Button size="sm" variant="outline">
                    LLM Model
                  </Button>
                  <Button size="sm" variant="outline">
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
                colorScheme="brand"
                onClick={handleGenerate}
              >
                Generate with this Model
              </Button>
            )}
            <HStack spacing={2} justify="center" width="100%" flexWrap="wrap">
              {onEdit && isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => onEdit(deck.id)}
                >
                  Edit Deck
                </Button>
              )}
              {onDelete && isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => onDelete(deck.id)}
                >
                  Delete Deck
                </Button>
              )}
              {onManageCards && isOwner && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={() => onManageCards(deck.id)}
                >
                  Manage Cards
                </Button>
              )}
              {onLearn && isOwner && (
                <Button
                  size="sm"
                  colorScheme="green"
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