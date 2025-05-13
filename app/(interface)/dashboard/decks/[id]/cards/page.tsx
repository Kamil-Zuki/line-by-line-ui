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
  Text as ChakraText,
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
import { fetchApi, DeckResponse } from "@/app/lib/api";
import { format } from "date-fns";
import { CardDto } from "@/app/interfaces";

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

  // Custom toast helper
  const showToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({
      position: "top",
      duration: status === "success" ? 3000 : 5000,
      isClosable: true,
      render: ({ onClose }: { onClose: () => void }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <ChakraText fontWeight="bold" fontSize="md">
              {title}
            </ChakraText>
            <ChakraText fontSize="sm">{description}</ChakraText>
          </VStack>
          <Button size="sm" onClick={onClose} color="white" variant="ghost">
            Close
          </Button>
        </Box>
      ),
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

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10} bg="gray.800">
        <Spinner size="xl" color="red.800" />
      </Box>
    );
  }

  if (!deck) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box
      p={{ base: 4, md: 6 }}
      maxW="1200px"
      mx="auto"
      bg="gray.800"
      color="white"
      position="relative"
      minH="100vh"
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background:
          "linear-gradient(45deg, rgba(255, 255, 255, 0.05), transparent)",
        opacity: 0.3,
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
    >
      <Box position="relative" zIndex={3}>
        <HStack justify="space-between" mb={6}>
          <Heading
            as="h1"
            size="lg"
            color="white"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
          >
            Cards for Deck: {deck.title}
          </Heading>
          <Button
            bg="red.800"
            border="2px solid"
            borderColor="blue.900"
            color="white"
            _hover={{
              bg: "red.700",
              boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
              transform: "scale(1.02)",
            }}
            _active={{ bg: "red.900" }}
            transition="all 0.2s"
            onClick={() => openModal()}
          >
            Add New Card
          </Button>
        </HStack>

        {cards.length === 0 ? (
          <ChakraText color="gray.300">
            No cards found. Add a new card to get started.
          </ChakraText>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr borderBottom="2px solid" borderColor="blue.900">
                <Th color="gray.400" textTransform="uppercase">
                  Front
                </Th>
                <Th color="gray.400" textTransform="uppercase">
                  Back
                </Th>
                <Th color="gray.400" textTransform="uppercase">
                  Skill
                </Th>
                <Th color="gray.400" textTransform="uppercase">
                  Created
                </Th>
                <Th color="gray.400" textTransform="uppercase">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {cards.map((card) => (
                <Tr
                  key={card.id}
                  bg="gray.700"
                  borderBottom="1px solid"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.600" }}
                >
                  <Td maxW="300px" isTruncated color="white">
                    {card.front}
                  </Td>
                  <Td maxW="300px" isTruncated color="white">
                    {card.back}
                  </Td>
                  <Td color="white">{card.skill}</Td>
                  <Td color="white">
                    {format(new Date(card.createdDate), "MMM dd, yyyy")}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        bg="red.800"
                        border="2px solid"
                        borderColor="blue.900"
                        color="white"
                        _hover={{
                          bg: "red.700",
                          boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                          transform: "scale(1.02)",
                        }}
                        _active={{ bg: "red.900" }}
                        transition="all 0.2s"
                        onClick={() => handleEdit(card.deckId, card.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        bg="red.800"
                        border="2px solid"
                        borderColor="blue.900"
                        color="white"
                        _hover={{
                          bg: "red.700",
                          boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                          transform: "scale(1.02)",
                        }}
                        _active={{ bg: "red.900" }}
                        transition="all 0.2s"
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

        {/* Create Card Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent
            bg="gray.800"
            color="white"
            border="2px solid"
            borderColor="blue.900"
            borderRadius="md"
          >
            <ModalHeader textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)">
              Create New Card
            </ModalHeader>
            <ModalCloseButton color="white" />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.front} isRequired>
                    <FormLabel
                      color="gray.400"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      Front
                    </FormLabel>
                    <Input
                      name="front"
                      value={formData.front}
                      onChange={handleInputChange}
                      placeholder="Enter card front"
                      maxLength={500}
                      bg="gray.700"
                      border="2px solid"
                      borderColor="blue.900"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "blue.700",
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                      }}
                    />
                    {errors.front && (
                      <ChakraText
                        color="red.500"
                        fontSize="sm"
                        mt={1}
                        fontWeight="bold"
                        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 3px rgba(229, 62, 62, 0.3)"
                      >
                        {errors.front}
                      </ChakraText>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.back} isRequired>
                    <FormLabel
                      color="gray.400"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      Back
                    </FormLabel>
                    <Input
                      name="back"
                      value={formData.back}
                      onChange={handleInputChange}
                      placeholder="Enter card back"
                      maxLength={500}
                      bg="gray.700"
                      border="2px solid"
                      borderColor="blue.900"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "blue.700",
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                      }}
                    />
                    {errors.back && (
                      <ChakraText
                        color="red.500"
                        fontSize="sm"
                        mt={1}
                        fontWeight="bold"
                        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 3px rgba(229, 62, 62, 0.3)"
                      >
                        {errors.back}
                      </ChakraText>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      color="gray.400"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      Hint (Optional)
                    </FormLabel>
                    <Textarea
                      name="hint"
                      value={formData.hint}
                      onChange={handleInputChange}
                      placeholder="Enter hint"
                      maxLength={500}
                      bg="gray.700"
                      border="2px solid"
                      borderColor="blue.900"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "blue.700",
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                      }}
                    />
                  </FormControl>

                  <FormControl isInvalid={!!errors.mediaUrl}>
                    <FormLabel
                      color="gray.400"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      Media URL (Optional)
                    </FormLabel>
                    <Input
                      name="mediaUrl"
                      value={formData.mediaUrl}
                      onChange={handleInputChange}
                      placeholder="Enter media URL (e.g., image/audio)"
                      bg="gray.700"
                      border="2px solid"
                      borderColor="blue.900"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "blue.700",
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                      }}
                    />
                    {errors.mediaUrl && (
                      <ChakraText
                        color="red.500"
                        fontSize="sm"
                        mt={1}
                        fontWeight="bold"
                        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 3px rgba(229, 62, 62, 0.3)"
                      >
                        {errors.mediaUrl}
                      </ChakraText>
                    )}
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      color="gray.400"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      Skill
                    </FormLabel>
                    <Select
                      name="skill"
                      value={formData.skill}
                      onChange={handleInputChange}
                      bg="gray.700"
                      border="2px solid"
                      borderColor="blue.900"
                      color="white"
                      borderRadius="md"
                      _focus={{
                        borderColor: "blue.700",
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                      }}
                    >
                      <option
                        value="Reading"
                        style={{ backgroundColor: "#1A202C", color: "white" }}
                      >
                        Reading
                      </option>
                      <option
                        value="Writing"
                        style={{ backgroundColor: "#1A202C", color: "white" }}
                      >
                        Writing
                      </option>
                      <option
                        value="Speaking"
                        style={{ backgroundColor: "#1A202C", color: "white" }}
                      >
                        Speaking
                      </option>
                      <option
                        value="Listening"
                        style={{ backgroundColor: "#1A202C", color: "white" }}
                      >
                        Listening
                      </option>
                    </Select>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  mr={3}
                  onClick={() => setIsModalOpen(false)}
                  color="white"
                  _hover={{ bg: "gray.700" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="red.800"
                  border="2px solid"
                  borderColor="blue.900"
                  color="white"
                  _hover={{
                    bg: "red.700",
                    boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                    transform: "scale(1.02)",
                  }}
                  _active={{ bg: "red.900" }}
                  transition="all 0.2s"
                >
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
            <AlertDialogContent
              bg="gray.800"
              color="white"
              border="2px solid"
              borderColor="blue.900"
              borderRadius="md"
            >
              <AlertDialogHeader
                fontSize="lg"
                fontWeight="bold"
                textShadow="1px 1px 2px rgba(0, 0, 0, 0.8)"
              >
                Delete Card
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete the card "{cardToDelete?.front}
                "? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsDeleteDialogOpen(false)}
                  color="white"
                  variant="ghost"
                  _hover={{ bg: "gray.700" }}
                >
                  Cancel
                </Button>
                <Button
                  bg="red.800"
                  border="2px solid"
                  borderColor="blue.900"
                  color="white"
                  _hover={{
                    bg: "red.700",
                    boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                    transform: "scale(1.02)",
                  }}
                  _active={{ bg: "red.900" }}
                  transition="all 0.2s"
                  onClick={handleDelete}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
}
