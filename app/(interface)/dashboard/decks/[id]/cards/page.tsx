"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  useToast,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Text,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useColorModeValue,
  TableContainer,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi } from "@/app/lib/api";
import { format } from "date-fns";
import { CardDto, DeckResponse } from "@/app/interfaces";

export default function DeckCardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [cards, setCards] = useState<CardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardDto | null>(null);
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    hint: "",
    mediaUrl: "",
    skill: "Reading" as "Reading" | "Writing" | "Speaking" | "Listening",
  });
  const [errors, setErrors] = useState({ front: "", back: "", mediaUrl: "" });
  const router = useRouter();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Unwrap params using React.use
  const { id } = React.use(params);

  // Toast helper
  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  // Fetch deck and cards
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch deck to verify ownership
        const deckResponse = await fetchApi<DeckResponse>(`/deck/${id}`);
        if (deckResponse.ownerId !== user?.id) {
          showToast(
            "Access Denied",
            "You can only manage cards for your own decks.",
            "error"
          );
          router.push("/dashboard/decks");
          return;
        }
        setDeck(deckResponse);

        // Fetch cards
        const cardsResponse = await fetchApi<CardDto[]>(`/card/${id}/cards`);
        setCards(cardsResponse);
      } catch (error: any) {
        console.error("Error fetching data:", error.message, {
          status: error.status,
        });
        showToast(
          "Error",
          "Failed to load deck or cards. Please try again.",
          "error"
        );
        router.push("/dashboard/decks");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading && user) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user, id, router]);

  // Reset form when opening modal for creating a new card
  const openModal = () => {
    setFormData({
      front: "",
      back: "",
      hint: "",
      mediaUrl: "",
      skill: "Reading",
    });
    setErrors({ front: "", back: "", mediaUrl: "" });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "front" || name === "back") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "mediaUrl" && value) {
      try {
        new URL(value);
        setErrors((prev) => ({ ...prev, mediaUrl: "" }));
      } catch {
        setErrors((prev) => ({ ...prev, mediaUrl: "Invalid URL format." }));
      }
    }
  };

  // Validate and submit form (for creating a new card)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.front.trim()) {
      setErrors((prev) => ({ ...prev, front: "Front is required." }));
      return;
    }
    if (!formData.back.trim()) {
      setErrors((prev) => ({ ...prev, back: "Back is required." }));
      return;
    }
    if (formData.front.length > 500) {
      setErrors((prev) => ({
        ...prev,
        front: "Front must be 500 characters or less.",
      }));
      return;
    }
    if (formData.back.length > 500) {
      setErrors((prev) => ({
        ...prev,
        back: "Back must be 500 characters or less.",
      }));
      return;
    }
    if (formData.mediaUrl && !isValidUrl(formData.mediaUrl)) {
      setErrors((prev) => ({ ...prev, mediaUrl: "Invalid URL format." }));
      return;
    }

    try {
      // Create card
      const newCard = await fetchApi<CardDto>(`/card`, {
        method: "POST",
        body: JSON.stringify({
          deckId: id,
          front: formData.front.trim(),
          back: formData.back.trim(),
          hint: formData.hint.trim() || undefined,
          mediaUrl: formData.mediaUrl.trim() || undefined,
          skill: formData.skill,
        }),
      });
      setCards((prev) => [...prev, newCard]);
      showToast("Success", "Card created successfully.", "success");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating card:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to create card. Please try again.", "error");
    }
  };

  // Handle card deletion
  const handleDelete = async () => {
    if (!cardToDelete) return;
    try {
      await fetchApi(`/card/${cardToDelete.id}`, {
        method: "DELETE",
      });
      setCards((prev) => prev.filter((card) => card.id !== cardToDelete.id));
      showToast("Success", "Card deleted successfully.", "success");
    } catch (error: any) {
      console.error("Error deleting card:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to delete card. Please try again.", "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setCardToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (card: CardDto) => {
    setCardToDelete(card);
    setIsDeleteDialogOpen(true);
  };

  // Navigate to edit page
  const handleEdit = (deckId: string, cardId: string) => {
    router.push(`/dashboard/decks/${deckId}/cards/${cardId}/edit`);
  };

  // Utility to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tableBg = useColorModeValue("white", "gray.700");
  const tableHoverBg = useColorModeValue("gray.50", "gray.600");

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  if (!deck) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Heading as="h1" size="xl">
          Manage Cards: {deck.title}
        </Heading>
        <Button colorScheme="brand" size="md" onClick={() => openModal()}>
          Add New Card
        </Button>
      </Flex>

      {cards.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.600" mb={4}>
            No cards found. Add a new card to get started.
          </Text>
        </Box>
      ) : (
        <Box
          bg={bg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Front</Th>
                  <Th>Back</Th>
                  <Th>Skill</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cards.map((card) => (
                  <Tr key={card.id} _hover={{ bg: tableHoverBg }}>
                    <Td maxW="300px" isTruncated>
                      {card.front}
                    </Td>
                    <Td maxW="300px" isTruncated>
                      {card.back}
                    </Td>
                    <Td>{card.skill}</Td>
                    <Td>
                      {format(new Date(card.createdDate), "MMM dd, yyyy")}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => handleEdit(card.deckId, card.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => openDeleteDialog(card)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Create Card Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Card</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.front} isRequired>
                  <FormLabel>Front</FormLabel>
                  <Input
                    name="front"
                    value={formData.front}
                    onChange={handleInputChange}
                    placeholder="Enter card front"
                    maxLength={500}
                  />
                  <FormErrorMessage>{errors.front}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.back} isRequired>
                  <FormLabel>Back</FormLabel>
                  <Input
                    name="back"
                    value={formData.back}
                    onChange={handleInputChange}
                    placeholder="Enter card back"
                    maxLength={500}
                  />
                  <FormErrorMessage>{errors.back}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Hint (Optional)</FormLabel>
                  <Textarea
                    name="hint"
                    value={formData.hint}
                    onChange={handleInputChange}
                    placeholder="Enter hint"
                    maxLength={500}
                    rows={3}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.mediaUrl}>
                  <FormLabel>Media URL (Optional)</FormLabel>
                  <Input
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleInputChange}
                    placeholder="Enter media URL (e.g., image/audio)"
                  />
                  <FormErrorMessage>{errors.mediaUrl}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Skill</FormLabel>
                  <Select
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                  >
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Listening">Listening</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="brand">
                Create Card
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Card
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the card "{cardToDelete?.front}"?
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
