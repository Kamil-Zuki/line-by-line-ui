import { Box, Button, Text, Image, HStack, VStack } from "@chakra-ui/react";
import { CardDto } from "@/app/lib/api";
import { useState } from "react";

interface CardReviewProps {
  card: CardDto;
  onReview: (quality: number) => void;
  imageSize?: string; // Add imageSize prop to control image dimensions
}

export function CardReview({ card, onReview, imageSize = "200px" }: CardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <VStack spacing={4} p={4} borderWidth="1px" borderRadius="md">
      <Text fontWeight="bold">{isFlipped ? card.back : card.front}</Text>
      {card.hint && !isFlipped && <Text color="gray.500">{card.hint}</Text>}
      {card.mediaUrl && (
        <Image
          src={card.mediaUrl}
          alt="Card media"
          width={imageSize}
          height={imageSize}
          objectFit="contain"
          borderRadius="md"
        />
      )}
      <Button onClick={() => setIsFlipped(!isFlipped)}>
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
      {isFlipped && (
        <HStack spacing={2}>
          <Button onClick={() => onReview(0)} colorScheme="red">
            Again
          </Button>
          <Button onClick={() => onReview(2)} colorScheme="orange">
            Hard
          </Button>
          <Button onClick={() => onReview(3)} colorScheme="teal">
            Good
          </Button>
          <Button onClick={() => onReview(5)} colorScheme="green">
            Easy
          </Button>
        </HStack>
      )}
    </VStack>
  );
}