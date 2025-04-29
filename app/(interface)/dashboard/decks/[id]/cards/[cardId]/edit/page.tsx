"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Text as ChakraText,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, CardDto, DeckResponse } from "@/app/lib/api";

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string; cardId: string }>;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [card, setCard] = useState<CardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Unwrap params using React.use
  const { id: deckId, cardId } = React.use(params);

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

  // Fetch card data
  useEffect(() => {
    const fetchCard = async () => {
      setIsLoading(true);
      try {
        const cardData = await fetchApi<CardDto>(`/card/${cardId}`);
        if (cardData.deckId !== deckId) {
          throw new Error("Card does not belong to this deck.");
        }
        if (
          user?.id !== (await fetchApi<DeckResponse>(`/deck/${deckId}`)).ownerId
        ) {
          throw new Error("You can only edit cards in your own decks.");
        }
        setCard(cardData);
        setFormData({
          front: cardData.front,
          back: cardData.back,
          hint: cardData.hint || "",
          mediaUrl: cardData.mediaUrl || "",
          skill: cardData.skill,
        });
      } catch (error: any) {
        console.error("Error fetching card:", error.message);
        showToast("Error", "Failed to load card. Please try again.", "error");
        router.push(`/dashboard/decks/${deckId}/cards`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading && user) {
      fetchCard();
    }
  }, [isAuthenticated, authLoading, user, cardId, deckId, router]);

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
      await fetchApi(`/card/${cardId}`, {
        method: "PUT",
        body: JSON.stringify({
          front: formData.front.trim(),
          back: formData.back.trim(),
          hint: formData.hint.trim() || undefined,
          mediaUrl: formData.mediaUrl.trim() || undefined,
          skill: formData.skill,
        }),
      });
      showToast("Success", "Card updated successfully.", "success");
      router.push(`/dashboard/decks/${deckId}/cards`);
    } catch (error: any) {
      console.error("Error updating card:", error.message);
      showToast("Error", "Failed to update card. Please try again.", "error");
    }
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

  if (!card) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box
      p={{ base: 4, md: 6 }}
      maxW="800px"
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
        <Heading
          as="h1"
          size="lg"
          mb={6}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)"
        >
          Edit Card
        </Heading>

        <form onSubmit={handleSubmit}>
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

            <VStack spacing={3} mt={6}>
              <Button
                type="submit"
                bg="red.800"
                border="2px solid"
                borderColor="blue.900"
                color="white"
                width="full"
                _hover={{
                  bg: "red.700",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                  transform: "scale(1.02)",
                }}
                _active={{ bg: "red.900" }}
                transition="all 0.2s"
              >
                Update Card
              </Button>
              <Button
                variant="ghost"
                color="white"
                width="full"
                _hover={{ bg: "gray.700" }}
                onClick={() => router.push(`/dashboard/decks/${deckId}/cards`)}
              >
                Cancel
              </Button>
            </VStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
