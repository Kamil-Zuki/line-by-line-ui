import { Box, Heading, Text, VStack, Badge } from "@chakra-ui/react";
import { DeckResponse } from "@/app/lib/api";

interface DeckCardProps {
  deck: DeckResponse;
  onClick: () => void;
  "aria-label": string;
}

export function DeckCard({ deck, onClick, "aria-label": ariaLabel }: DeckCardProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      aria-label={ariaLabel}
      bg="gray.700"
      p={4}
      border="2px solid"
      borderColor="blue.900"
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
      width={{ base: "100%", sm: "300px" }}
      height="200px"
      borderRadius="md"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
        opacity: 0.3,
        zIndex: 1,
      }}
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)", // Soft blue glow
        borderColor: "blue.800",
      }}
      _focus={{
        outline: "none",
        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.5)",
      }}
      transition="all 0.2s"
    >
      <VStack align="start" spacing={2} height="100%" position="relative" zIndex={2}>
        <Heading
          as="h3"
          size="md"
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
          noOfLines={1}
        >
          {deck.title}
        </Heading>
        <Text
          fontSize="sm"
          color="gray.400"
          noOfLines={2}
          flex="1"
          textAlign="left"
        >
          {deck.description || "No description available."}
        </Text>
        <Box display="flex" gap={2}>
          <Badge
            colorScheme="blue"
            borderRadius="md"
            border="1px solid"
            borderColor="blue.900"
            px={2}
            py={1}
            fontSize="xs"
            textTransform="uppercase"
            bg="blue.800"
            color="white"
          >
            Cards: {deck.cardCount}
          </Badge>
          <Badge
            colorScheme="red"
            borderRadius="md"
            border="1px solid"
            borderColor="red.800"
            px={2}
            py={1}
            fontSize="xs"
            textTransform="uppercase"
            bg="red.800"
            color="white"
          >
            Subs: {deck.subscriberCount}
          </Badge>
        </Box>
      </VStack>
    </Box>
  );
}