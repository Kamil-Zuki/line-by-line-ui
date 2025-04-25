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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse, CardDto } from "@/app/lib/api";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDto | null>(null);
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

  // Fetch deck and cards
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch deck to verify ownership
        const deckResponse = await fetchApi<DeckResponse>(`/deck/${id}`);
        if (deckResponse.ownerId !== user?.id) {
          toast({
            title: "Access Denied",
            description: "You can only manage cards for your own decks.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
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
        toast({
          title: "Error",
          description: "Failed to load deck or cards. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push("/dashboard/decks");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading && user) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user, id, router, toast]);

  // Reset form when opening modal
  const openModal = (card: CardDto | null = null) => {
    setIsEditMode(!!card);
    setSelectedCard(card);
    setFormData({
      front: card?.front || "",
      back: card?.back || "",
      hint: card?.hint || "",
      mediaUrl: card?.mediaUrl || "",
      skill: card?.skill || "Reading",
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

  // Validate and submit form
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
      if (isEditMode && selectedCard) {
        // Update card (assumed endpoint)
        await fetchApi(`/card/${selectedCard.id}`, {
          method: "PUT",
          body: JSON.stringify({
            front: formData.front.trim(),
            back: formData.back.trim(),
            hint: formData.hint.trim() || undefined,
            mediaUrl: formData.mediaUrl.trim() || undefined,
            skill: formData.skill,
          }),
        });
        setCards((prev) =>
          prev.map((card) =>
            card.id === selectedCard.id
              ? {
                  ...card,
                  ...formData,
                  hint: formData.hint || undefined,
                  mediaUrl: formData.mediaUrl || undefined,
                }
              : card
          )
        );
        toast({
          title: "Success",
          description: "Card updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
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
        toast({
          title: "Success",
          description: "Card created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving card:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: `Failed to ${
          isEditMode ? "update" : "create"
        } card. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: "Success",
        description: "Card deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error deleting card:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: "Failed to delete card. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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

  // Utility to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (!deck) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
      <HStack justify="space-between" mb={6}>
        <Heading as="h1" size="lg">
          Cards for Deck: {deck.title}
        </Heading>
        <Button colorScheme="teal" onClick={() => openModal()}>
          Add New Card
        </Button>
      </HStack>

      {cards.length === 0 ? (
        <Text>No cards found. Add a new card to get started.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Front</Th>
              <Th>Back</Th>
              <Th>Skill</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cards.map((card) => (
              <Tr key={card.id}>
                <Td maxW="300px" isTruncated>
                  {card.front}
                </Td>
                <Td maxW="300px" isTruncated>
                  {card.back}
                </Td>
                <Td>{card.skill}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      onClick={() => openModal(card)}
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
      )}

      {/* Create/Edit Card Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Card" : "Create New Card"}
          </ModalHeader>
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
                  {errors.front && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.front}
                    </Text>
                  )}
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
                  {errors.back && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.back}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Hint (Optional)</FormLabel>
                  <Textarea
                    name="hint"
                    value={formData.hint}
                    onChange={handleInputChange}
                    placeholder="Enter hint"
                    maxLength={500}
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
                  {errors.mediaUrl && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.mediaUrl}
                    </Text>
                  )}
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
                variant="outline"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="teal">
                {isEditMode ? "Update Card" : "Create Card"}
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
