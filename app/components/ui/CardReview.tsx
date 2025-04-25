"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CardDto } from "@/app/lib/api";

interface CardReviewProps {
  card: CardDto;
  onReview: (quality: number) => void;
}

export function CardReview({ card, onReview }: CardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <VStack
      spacing={4}
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      maxW="600px"
      w="full"
    >
      <Text fontWeight="bold" fontSize="xl">
        {isFlipped ? card.back : card.front}
      </Text>
      {card.hint && !isFlipped && (
        <Text color="gray.500" fontStyle="italic">
          Hint: {card.hint}
        </Text>
      )}
      {card.mediaUrl && (
        <>
          {card.skill === "Listening" ? (
            <audio controls src={card.mediaUrl} style={{ maxWidth: "100%" }} />
          ) : (
            <Image
              src={card.mediaUrl}
              alt="Card media"
              maxH="200px"
              objectFit="contain"
            />
          )}
        </>
      )}
      <Button
        colorScheme="teal"
        onClick={() => setIsFlipped(!isFlipped)}
        width="150px"
      >
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
      {isFlipped && (
        <HStack spacing={2} wrap="wrap" justify="center">
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => {
              onReview(0);
              setIsFlipped(false);
            }}
          >
            Again
          </Button>
          <Button
            colorScheme="orange"
            size="sm"
            onClick={() => {
              onReview(2);
              setIsFlipped(false);
            }}
          >
            Hard
          </Button>
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => {
              onReview(3);
              setIsFlipped(false);
            }}
          >
            Good
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => {
              onReview(5);
              setIsFlipped(false);
            }}
          >
            Easy
          </Button>
        </HStack>
      )}
    </VStack>
  );
}
