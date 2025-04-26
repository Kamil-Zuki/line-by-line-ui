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
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent
        bg="gray.900"
        color="white"
        borderRadius="0"
        border="3px solid"
        borderColor="white"
        boxShadow="0 0 10px rgba(255, 255, 255, 0.3)"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "-3px",
          left: "-3px",
          right: "-3px",
          bottom: "-3px",
          border: "2px solid",
          borderColor: "red.600",
          boxShadow: "0 0 15px rgba(229, 62, 62, 0.5)",
        }}
      >
        <ModalHeader p={4}>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Avatar
                name={deck.authorNickname || "Unknown"}
                size="sm"
                bg="blue.500"
                color="white"
                border="2px solid"
                borderColor="white"
              />
              <Text fontSize="sm" fontWeight="bold" textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
                {deck.authorNickname || "Unknown"}
              </Text>
              {!isOwner && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="blue.500"
                    color="blue.500"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ bg: "blue.500", color: "white", boxShadow: "0 0 10px rgba(49, 130, 206, 0.7)" }}
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="red.600"
                    color="red.600"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ bg: "red.600", color: "white", boxShadow: "0 0 10px rgba(229, 62, 62, 0.7)" }}
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
            color="white"
            textTransform="uppercase"
            letterSpacing="wide"
            textShadow="2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 255, 255, 0.3)"
          >
            {deck.title}
          </Text>
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ color: "red.600", transform: "scale(1.1)" }} />
        <ModalBody p={4}>
          <VStack spacing={6} align="stretch">
            {/* Deck Image */}
            {deck.imageUrl ? (
              <Image
                src={deck.imageUrl}
                alt={`${deck.title} image`}
                borderRadius="0"
                maxH="200px"
                objectFit="cover"
                border="2px solid"
                borderColor="white"
                boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)"
              />
            ) : (
              <Box
                bg="gray.800"
                borderRadius="0"
                h="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="white"
                boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)"
              >
                <Text color="gray.400" fontWeight="bold" textTransform="uppercase">
                  No Image Available
                </Text>
              </Box>
            )}

            {/* Deck Stats */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
              <Stat bg="gray.800" p={2} border="1px solid" borderColor="white" boxShadow="2px 2px 0 rgba(0, 0, 0, 0.8)">
                <StatLabel color="gray.400" fontWeight="bold" textTransform="uppercase">Cards</StatLabel>
                <StatNumber color="white">{deck.cardCount ?? "N/A"}</StatNumber>
              </Stat>
              <Stat bg="gray.800" p={2} border="1px solid" borderColor="white" boxShadow="2px 2px 0 rgba(0, 0, 0, 0.8)">
                <StatLabel color="gray.400" fontWeight="bold" textTransform="uppercase">Subscribers</StatLabel>
                <StatNumber color="white">{deck.subscriberCount ?? "N/A"}</StatNumber>
              </Stat>
              <Stat bg="gray.800" p={2} border="1px solid" borderColor="white" boxShadow="2px 2px 0 rgba(0, 0, 0, 0.8)">
                <StatLabel color="gray.400" fontWeight="bold" textTransform="uppercase">Difficulty</StatLabel>
                <StatNumber color="white">
                  {deck.averageDifficulty ? deck.averageDifficulty.toFixed(1) : "N/A"}
                </StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Description */}
            <VStack align="start" spacing={2}>
              <Text fontSize="md" fontWeight="extrabold" color="red.600" textTransform="uppercase" textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
                Description
              </Text>
              <Text color="gray.300" fontSize="sm">{deck.description || "No description available"}</Text>
            </VStack>

            {/* Tags */}
            {deck.tags && deck.tags.length > 0 && (
              <VStack align="start" spacing={2}>
                <Text fontSize="md" fontWeight="extrabold" color="red.600" textTransform="uppercase" textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
                  Tags
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {deck.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="sm"
                      variant="solid"
                      bg="blue.500"
                      color="white"
                      fontWeight="bold"
                      textTransform="uppercase"
                      border="1px solid"
                      borderColor="white"
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            )}

            {/* Created Date */}
            <Text fontSize="sm" color="gray.400" fontWeight="bold">
              Created: {new Date(deck.createdDate).toLocaleString()}
            </Text>

            {/* AI Features Toggle */}
            <Button
              onClick={() => setShowAIFeatures(!showAIFeatures)}
              variant="outline"
              borderColor="green.500"
              color="green.500"
              fontWeight="bold"
              textTransform="uppercase"
              _hover={{ bg: "green.500", color: "white", boxShadow: "0 0 10px rgba(72, 187, 120, 0.7)" }}
              size="md"
              mb={2}
            >
              {showAIFeatures ? "Hide AI Features" : "Show AI Features"}
            </Button>

            {/* AI Features Section */}
            {showAIFeatures && (
              <VStack spacing={4} align="stretch" border="2px solid" borderColor="white" p={4} boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)">
                <VStack align="start">
                  <Text fontSize="md" fontWeight="extrabold" color="blue.500" textTransform="uppercase" textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
                    Prompt Details
                  </Text>
                  <Textarea
                    value={deck.description || "No description available"}
                    isDisabled
                    resize="none"
                    bg="gray.800"
                    borderColor="white"
                    color="white"
                    minH="100px"
                    borderRadius="0"
                    borderWidth="2px"
                  />
                </VStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ bg: "gray.700", boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                  >
                    LLM Model
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ bg: "gray.700", boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                  >
                    LLM Model
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ bg: "gray.700", boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                  >
                    LLM Model
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter p={4}>
          <VStack spacing={3} width="100%">
            {showAIFeatures && (
              <Button
                width="100%"
                bgGradient="linear(to-r, gray.900, blue.500)"
                color="white"
                fontWeight="extrabold"
                textTransform="uppercase"
                border="2px solid"
                borderColor="white"
                _hover={{ opacity: 0.9, boxShadow: "0 0 15px rgba(49, 130, 206, 0.7)", transform: "scale(0.98)" }}
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
                  borderColor="blue.500"
                  color="blue.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  _hover={{ bg: "blue.500", color: "white", boxShadow: "0 0 10px rgba(49, 130, 206, 0.7)" }}
                  onClick={() => onEdit(deck.id)}
                >
                  Edit Deck
                </Button>
              )}
              {onDelete && isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="red.600"
                  color="red.600"
                  fontWeight="bold"
                  textTransform="uppercase"
                  _hover={{ bg: "red.600", color: "white", boxShadow: "0 0 10px rgba(229, 62, 62, 0.7)" }}
                  onClick={() => onDelete(deck.id)}
                >
                  Delete Deck
                </Button>
              )}
              {onManageCards && isOwner && (
                <Button
                  size="sm"
                  bg="blue.500"
                  color="white"
                  fontWeight="bold"
                  textTransform="uppercase"
                  border="2px solid"
                  borderColor="white"
                  _hover={{ bg: "blue.600", boxShadow: "0 0 10px rgba(49, 130, 206, 0.7)", transform: "scale(0.98)" }}
                  onClick={() => onManageCards(deck.id)}
                >
                  Manage Cards
                </Button>
              )}
              {onLearn && isOwner && (
                <Button
                  size="sm"
                  bg="red.600"
                  color="white"
                  fontWeight="bold"
                  textTransform="uppercase"
                  border="2px solid"
                  borderColor="white"
                  _hover={{ bg: "red.700", boxShadow: "0 0 10px rgba(229, 62, 62, 0.7)", transform: "scale(0.98)" }}
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