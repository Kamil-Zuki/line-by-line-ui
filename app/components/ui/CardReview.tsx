// app/components/ui/CardReview.tsx
import {
  Box,
  Button,
  Text,
  Image,
  HStack,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { CardDto } from "@/app/interfaces";
import { useState } from "react";

interface CardReviewProps {
  card: CardDto;
  onReview: (quality: number) => void;
  imageSize?: string;
}

export function CardReview({
  card,
  onReview,
  imageSize = "200px",
}: CardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(!!card.mediaUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle flip with keyboard accessibility
  const handleFlip = () => setIsFlipped(!isFlipped);

  // Handle review submission
  const handleReviewClick = async (quality: number) => {
    if (typeof onReview !== "function") {
      console.error("onReview is not a function");
      return;
    }
    setIsSubmitting(true);
    try {
      await onReview(quality);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack
      spacing={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.800"
      borderColor="blue.900"
      boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
      w="100%"
      maxW="600px"
      mx="auto"
      role="region"
      aria-label="Card Review"
    >
      <Text
        fontWeight="bold"
        fontSize="lg"
        color="white"
        textAlign="center"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
      >
        {isFlipped ? card.back : card.front}
      </Text>
      {card.hint && !isFlipped && (
        <Text color="gray.300" fontSize="sm" textAlign="center">
          Hint: {card.hint}
        </Text>
      )}
      {card.mediaUrl && (
        <Box position="relative" w={imageSize} h={imageSize}>
          {isLoadingImage && (
            <Spinner
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="white"
            />
          )}
          <Image
            src={card.mediaUrl}
            alt={isFlipped ? card.back : card.front}
            width={imageSize}
            height={imageSize}
            objectFit="contain"
            borderRadius="md"
            onLoad={() => setIsLoadingImage(false)}
            onError={() => setIsLoadingImage(false)} // Fallback if image fails
            display={isLoadingImage ? "none" : "block"}
          />
        </Box>
      )}
      <Button
        onClick={handleFlip}
        aria-label={`Flip card to ${isFlipped ? "front" : "back"}`}
        bg="gray.700"
        color="white"
        _hover={{ bg: "gray.600", transform: "scale(1.02)" }}
        _active={{ bg: "gray.800" }}
        transition="all 0.2s"
        w="full"
      >
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
      {isFlipped && (
        <HStack spacing={2} w="full" justify="center">
          <Button
            onClick={() => handleReviewClick(0)}
            colorScheme="red"
            aria-label="Rate as Again"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Again
          </Button>
          <Button
            onClick={() => handleReviewClick(1)}
            colorScheme="orange"
            aria-label="Rate as Hard"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ bg: "orange.900" }}
            transition="all 0.2s"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Hard
          </Button>
          <Button
            onClick={() => handleReviewClick(2)}
            colorScheme="teal"
            aria-label="Rate as Good"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ bg: "teal.900" }}
            transition="all 0.2s"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Good
          </Button>
          <Button
            onClick={() => handleReviewClick(3)}
            colorScheme="green"
            aria-label="Rate as Easy"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ bg: "green.900" }}
            transition="all 0.2s"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Easy
          </Button>
        </HStack>
      )}
    </VStack>
  );
}
