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
      bg="black"
      p={4}
      border="2px solid"
      borderColor="red.500"
      boxShadow="4px 4px 0 rgba(0, 0, 0, 0.8)"
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
        background: "radial-gradient(circle at 10% 10%, transparent 0%, transparent 10%, white 11%, transparent 12%)",
        backgroundSize: "20px 20px",
        opacity: 0.2,
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: "linear-gradient(45deg, transparent, blue.500, transparent)",
        opacity: 0,
        transform: "rotate(45deg)",
        transition: "opacity 0.3s, transform 0.3s",
      }}
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)", // Blue glow for Spidey
        borderColor: "blue.500",
        _after: {
          opacity: 0.3,
          transform: "rotate(45deg) translate(20%, 20%)",
        },
      }}
      _focus={{
        outline: "none",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.7)",
      }}
    >
      <VStack align="start" spacing={2} height="100%" position="relative" zIndex={2}>
        <Heading
          as="h3"
          size="md"
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(255, 215, 0, 0.3)" // Yellow glow for Spidey
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
            colorScheme="red"
            borderRadius="md"
            border="1px solid"
            borderColor="red.500"
            px={2}
            py={1}
            fontSize="xs"
            textTransform="uppercase"
          >
            Cards: {deck.cardCount}
          </Badge>
          <Badge
            colorScheme="blue"
            borderRadius="md"
            border="1px solid"
            borderColor="blue.500"
            px={2}
            py={1}
            fontSize="xs"
            textTransform="uppercase"
          >
            Subs: {deck.subscriberCount}
          </Badge>
        </Box>
      </VStack>
    </Box>
  );
}