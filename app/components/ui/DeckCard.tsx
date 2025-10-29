import { Box, Heading, Text, VStack, Badge, HStack } from "@chakra-ui/react";
import { DeckResponse } from "@/app/interfaces";

interface DeckCardProps {
  deck: DeckResponse;
  onClick: () => void;
  "aria-label": string;
}

export function DeckCard({
  deck,
  onClick,
  "aria-label": ariaLabel,
}: DeckCardProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      aria-label={ariaLabel}
      bg="white"
      p={5}
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="sm"
      width={{ base: "100%", sm: "300px" }}
      minHeight="180px"
      borderRadius="lg"
      _hover={{
        boxShadow: "md",
        borderColor: "brand.500",
        transform: "translateY(-2px)",
      }}
      _focus={{
        outline: "none",
        boxShadow: "outline",
      }}
      transition="all 0.2s"
      textAlign="left"
    >
      <VStack
        align="start"
        spacing={3}
        height="100%"
      >
        <Heading
          as="h3"
          size="md"
          color="gray.800"
          noOfLines={2}
        >
          {deck.title}
        </Heading>
        <Text
          fontSize="sm"
          color="gray.600"
          noOfLines={2}
          flex="1"
        >
          {deck.description || "No description available."}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="blue" borderRadius="md">
            {deck.cardCount} cards
          </Badge>
          <Badge colorScheme="green" borderRadius="md">
            {deck.subscriberCount} subs
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
}
