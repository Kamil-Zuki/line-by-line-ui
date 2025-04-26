"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Text as ChakraText,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { CardDto } from "@/app/lib/api";

interface CardReviewProps {
  card: CardDto;
  onReview: (quality: number) => void;
}

export function CardReview({ card, onReview }: CardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset isFlipped when the card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  // Use useCallback to ensure the handler is stable
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  return (
    <VStack
      spacing={4}
      p={6}
      bg="gray.700"
      border="2px solid"
      borderColor="blue.900"
      borderRadius="md"
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)" // Comic panel shadow
      maxW="600px"
      w="full"
      mx="auto" // Ensure the CardReview itself is centered within its parent
      align="center" // Center children horizontally
      position="relative"
      _hover={{
        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)", // Soft blue glow on hover
      }}
      transition="all 0.2s"
    >
      <ChakraText
        fontWeight="bold"
        fontSize="xl"
        color="white"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
        textAlign="center" // Center the text
      >
        {isFlipped ? card.back : card.front}
      </ChakraText>
      {card.hint && !isFlipped && (
        <ChakraText
          color="gray.300"
          fontStyle="italic"
          textAlign="center" // Center the hint text
        >
          Hint: {card.hint}
        </ChakraText>
      )}
      {card.mediaUrl && (
        <Box display="flex" justifyContent="center" w="full"> {/* Center media */}
          {card.skill === "Listening" ? (
            <Box as="audio" controls src={card.mediaUrl} maxW="100%" sx={{
              "&::-webkit-media-controls-panel": {
                backgroundColor: "gray.600",
                border: "1px solid",
                borderColor: "blue.900",
              },
              "&::-webkit-media-controls-play-button, &::-webkit-media-controls-volume-slider": {
                filter: "brightness(1.2)",
              },
            }} />
          ) : (
            <Image
              src={card.mediaUrl}
              alt="Card media"
              maxH="200px"
              objectFit="contain"
              border="1px solid"
              borderColor="blue.900"
              borderRadius="md"
            />
          )}
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
        width="150px"
        onClick={handleFlip} // Use the stable handler
      >
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
      {isFlipped && (
        <HStack spacing={2} wrap="wrap" justify="center">
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="red.600"
            color="white"
            size="sm"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            onClick={() => {
              onReview(0);
              setIsFlipped(false);
            }}
          >
            Again
          </Button>
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="orange.600"
            color="white"
            size="sm"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            onClick={() => {
              onReview(2);
              setIsFlipped(false);
            }}
          >
            Hard
          </Button>
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="teal.600"
            color="white"
            size="sm"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            onClick={() => {
              onReview(3);
              setIsFlipped(false);
            }}
          >
            Good
          </Button>
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="green.600"
            color="white"
            size="sm"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
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