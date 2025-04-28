"use client";

import { useCards } from "@/app/hooks/useCards";
import { CardTableRow } from "@/app/types/card";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";

export default function AllCardsPage() {
  const { cards, loading, error } = useCards();

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading as="h1" size="2xl" mb={6} textAlign="center">
        All Cards
      </Heading>

      {loading ? (
        <VStack spacing={4} align="center" py={10}>
          <Spinner size="xl" color="brand.primary" />
          <Text>Loading cards...</Text>
        </VStack>
      ) : error ? (
        <VStack spacing={4} align="center" py={10}>
          <Text color="red.500" fontSize="lg">
            Error: {error}
          </Text>
        </VStack>
      ) : cards.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.400">
          No cards found.
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Front</Th>
                <Th>Back</Th>
                <Th>Hint</Th>
                <Th>Deck</Th>
                <Th>Created</Th>
                <Th>Next Review</Th>
                <Th>Interval (Days)</Th>
                <Th>Easiness</Th>
                <Th>Repetitions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cards.map((card: CardTableRow) => (
                <Tr key={card.id}>
                  <Td>{card.front}</Td>
                  <Td>{card.back}</Td>
                  <Td>{card.hint || "-"}</Td>
                  <Td>{card.deckName}</Td>
                  <Td>{format(new Date(card.createdDate), "MMM dd, yyyy")}</Td>
                  <Td>
                    {card.nextReviewDate
                      ? format(new Date(card.nextReviewDate), "MMM dd, yyyy")
                      : "-"}
                  </Td>
                  <Td>{card.interval}</Td>
                  <Td>{card.easiness.toFixed(2)}</Td>
                  <Td>{card.repetitions}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}