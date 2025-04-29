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
  Select,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaSortUp, FaSortDown } from "react-icons/fa";

export default function AllCardsPage() {
  const { cards, loading, error } = useCards();
  const router = useRouter();

  // State for sorting and filtering
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [filterDeck, setFilterDeck] = useState<string>("");

  // Get unique deck titles for the filter dropdown
  const deckTitles = useMemo(() => {
    const titles = new Set(cards.map((card) => card.deckTitle));
    return ["", ...Array.from(titles)]; // Include empty option for "All Decks"
  }, [cards]);

  // Sort and filter cards
  const displayedCards = useMemo(() => {
    let filtered = [...cards];

    // Apply filter by deckTitle
    if (filterDeck) {
      filtered = filtered.filter((card) => card.deckTitle === filterDeck);
    }

    // Apply sorting by nextReviewDate
    if (sortOrder) {
      filtered.sort((a, b) => {
        const dateA = a.nextReviewDate
          ? new Date(a.nextReviewDate).getTime()
          : 0;
        const dateB = b.nextReviewDate
          ? new Date(b.nextReviewDate).getTime()
          : 0;

        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return filtered;
  }, [cards, sortOrder, filterDeck]);

  // Toggle sorting order
  const toggleSort = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder(null); // Reset sorting
    } else {
      setSortOrder("asc");
    }
  };

  // Navigate to edit page
  const handleEdit = (deckId: string, cardId: string) => {
    router.push(`/dashboard/decks/${deckId}/cards/${cardId}/edit`);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading as="h1" size="2xl" mb={6} textAlign="center">
        All Cards
      </Heading>

      {/* Filter Controls */}
      <Flex mb={4} justifyContent="flex-end">
        <Select
          w="200px"
          placeholder="Filter by Deck"
          value={filterDeck}
          onChange={(e) => setFilterDeck(e.target.value)}
          bg="gray.700"
          borderColor="blue.900"
        >
          {deckTitles.map((title) => (
            <option key={title || "all"} value={title}>
              {title || "All Decks"}
            </option>
          ))}
        </Select>
      </Flex>

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
      ) : displayedCards.length === 0 ? (
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
                <Th>Deck Title</Th>
                <Th>Created</Th>
                <Th cursor="pointer" onClick={toggleSort}>
                  <Flex alignItems="center">
                    Next Review
                    {sortOrder === "asc" && <Icon as={FaSortUp} ml={2} />}
                    {sortOrder === "desc" && <Icon as={FaSortDown} ml={2} />}
                  </Flex>
                </Th>
                <Th>Interval (Days)</Th>
                <Th>Easiness</Th>
                <Th>Repetitions</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedCards.map((card: CardTableRow) => (
                <Tr key={card.id}>
                  <Td>{card.front}</Td>
                  <Td>{card.back}</Td>
                  <Td>{card.hint || "-"}</Td>
                  <Td>{card.deckTitle}</Td>
                  <Td>{format(new Date(card.createdDate), "MMM dd, yyyy")}</Td>
                  <Td>
                    {card.nextReviewDate
                      ? format(new Date(card.nextReviewDate), "MMM dd, yyyy")
                      : "-"}
                  </Td>
                  <Td>{card.interval}</Td>
                  <Td>{card.easiness.toFixed(2)}</Td>
                  <Td>{card.repetitions}</Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(card.deckId, card.id)}
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
