import { Box, Text, Image, Icon } from "@chakra-ui/react";
import { FaLockOpen } from "react-icons/fa";
import { DeckResponse } from "@/app/lib/api";

interface DeckCardProps {
  deck: DeckResponse;
}

export function DeckCard({ deck }: DeckCardProps) {
  return (
    <Box
      w="300px"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      position="relative"
    >
      {deck.imageUrl ? (
        <Image
          src={deck.imageUrl}
          alt={deck.title}
          borderRadius="md"
          mb={2}
          h="150px"
          objectFit="cover"
        />
      ) : (
        <Box bg="gray.200" h="150px" borderRadius="md" mb={2} />
      )}
      <Text fontSize="lg" fontWeight="bold">
        {deck.title}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {deck.description || "No description"}
      </Text>
      <Text fontSize="sm" mt={2}>
        Cards: {deck.cardCount} | Subscribers: {deck.subscriberCount}
      </Text>
      <Icon
        as={FaLockOpen}
        position="absolute"
        bottom={2}
        right={2}
        color="green.500"
        boxSize={6}
      />
    </Box>
  );
}
