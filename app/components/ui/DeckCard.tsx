import { Box, Text, Image, VStack } from "@chakra-ui/react";
import { DeckResponse } from "@/app/lib/api";

interface DeckCardProps {
  deck: DeckResponse;
  onClick: () => void;
}

export function DeckCard({ deck, onClick }: DeckCardProps) {
  return (
    <Box
      as="button" // Make the card a button for accessibility
      p={4}
      borderWidth="1px"
      borderRadius="md"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      _focus={{ outline: "2px solid", outlineColor: "teal.500" }}
      onClick={onClick}
      width="250px"
      textAlign="left"
      aria-label={`View details for ${deck.title}`}
    >
      <VStack spacing={2} align="start">
        {deck.imageUrl ? (
          <Image
            src={deck.imageUrl}
            alt={`Image for ${deck.title}`}
            borderRadius="md"
            h="100px"
            w="100%"
            objectFit="cover"
          />
        ) : (
          <Box
            bg="gray.200"
            h="100px"
            w="100%"
            borderRadius="md"
            aria-hidden="true"
          />
        )}
        <Text fontWeight="bold" noOfLines={1}>
          {deck.title}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {deck.description || "No description"}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Cards: {deck.cardCount} • Created:{" "}
          {new Date(deck.createdDate).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  );
}
