"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Button,
  useToast,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Spinner,
  Text as ChakraText,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

export default function DeckEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [deck, setDeck] = useState<DeckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({ title: "", tags: "" });
  const router = useRouter();
  const toast = useToast();

  // Custom toast renderer for Ultimate Spider-Man style
  const showToast = (title: string, description: string, status: "success" | "error") => {
    toast({
      position: "top",
      duration: 3000,
      isClosable: true,
      render: ({ onClose }) => (
        <Box
          bg="gray.800"
          border="2px solid"
          borderColor="blue.900"
          color="white"
          p={4}
          borderRadius="md"
          boxShadow="0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: "gray.700" }}
        >
          <VStack align="start" spacing={1}>
            <Heading as="h3" size="sm" color="white">
              {title}
            </Heading>
            <ChakraText fontSize="sm">{description}</ChakraText>
          </VStack>
          <CloseButton onClick={onClose} color="white" />
        </Box>
      ),
    });
  };

  // Unwrap params using React.use
  const { id } = React.use(params);

  // Fetch deck details
  useEffect(() => {
    const fetchDeck = async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi<DeckResponse>(`/deck/${id}`);
        if (response.ownerId !== user?.id) {
          showToast("Access Denied", "You can only edit your own decks.", "error");
          router.push("/dashboard/decks");
          return;
        }
        setDeck(response);
        setFormData({
          title: response.title,
          description: response.description || "",
          isPublic: response.isPublic,
          tags: response.tags || [],
        });
      } catch (error: any) {
        console.error("Error fetching deck:", error.message, {
          status: error.status,
        });
        showToast("Error", "Failed to load deck. Please try again.", "error");
        router.push("/dashboard/decks");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && !authLoading && user) {
      fetchDeck();
    }
  }, [isAuthenticated, authLoading, user, id, router]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "title") {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  // Handle public/private toggle
  const handleTogglePublic = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags.length >= 10) {
      setErrors((prev) => ({ ...prev, tags: "Maximum 10 tags allowed." }));
      return;
    }
    if (formData.tags.includes(newTag.trim())) {
      setErrors((prev) => ({ ...prev, tags: "Tag already exists." }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag("");
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors((prev) => ({ ...prev, title: "Title is required." }));
      return;
    }
    if (formData.title.length > 100) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be 100 characters or less.",
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchApi(`/deck/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          isPublic: formData.isPublic,
          tags: formData.tags,
        }),
      });
      showToast("Success", "Deck updated successfully.", "success");
      router.push(`/dashboard/decks`);
    } catch (error: any) {
      console.error("Error updating deck:", error.message, {
        status: error.status,
      });
      showToast("Error", "Failed to update deck. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner
          size="xl"
          color="white"
          thickness="3px"
          speed="0.65s"
          _hover={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
        />
      </Box>
    );
  }

  if (!deck) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={{ base: 4, md: 6 }}
      bg="gray.800"
      border="2px solid"
      borderColor="blue.900"
      borderRadius="md"
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.5)" // Comic panel shadow
      position="relative"
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
      _after={{
        content: '""',
        position: "absolute",
        top: "-2px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "2px",
        bg: "white",
        boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
        zIndex: 2,
      }}
    >
      <VStack spacing={6} align="stretch" position="relative" zIndex={3}>
        <Heading
          as="h1"
          size={{ base: "lg", md: "xl" }}
          mb={2}
          color="white"
          textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
        >
          Edit Deck: {deck.title}
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isInvalid={!!errors.title} isRequired>
              <FormLabel
                color="gray.300"
                textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
              >
                Title
              </FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter deck title"
                maxLength={100}
                bg="gray.700"
                color="white"
                borderColor="blue.900"
                _hover={{ borderColor: "blue.800", transform: "scale(1.01)" }}
                _focus={{
                  borderColor: "blue.700",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                  transform: "scale(1.01)",
                }}
                _placeholder={{ color: "gray.500" }}
                transition="all 0.2s"
              />
              {errors.title && (
                <ChakraText color="red.400" fontSize="sm" mt={1}>
                  {errors.title}
                </ChakraText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel
                color="gray.300"
                textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
              >
                Description
              </FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter deck description (optional)"
                maxLength={500}
                rows={4}
                bg="gray.700"
                color="white"
                borderColor="blue.900"
                _hover={{ borderColor: "blue.800", transform: "scale(1.01)" }}
                _focus={{
                  borderColor: "blue.700",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                  transform: "scale(1.01)",
                }}
                _placeholder={{ color: "gray.500" }}
                transition="all 0.2s"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel
                mb={0}
                color="gray.300"
                textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
              >
                Public
              </FormLabel>
              <Switch
                isChecked={formData.isPublic}
                onChange={handleTogglePublic}
                colorScheme="blue"
                sx={{
                  ".chakra-switch__track": {
                    bg: "gray.600",
                    border: "1px solid",
                    borderColor: "blue.900",
                    _checked: {
                      bg: "blue.900",
                      borderColor: "blue.700",
                      boxShadow: "0 0 3px rgba(66, 153, 225, 0.3)",
                    },
                  },
                  ".chakra-switch__thumb": {
                    bg: "gray.300",
                    _checked: { bg: "white" },
                  },
                }}
                _hover={{ ".chakra-switch__track": { borderColor: "blue.800" } }}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.tags}>
              <FormLabel
                color="gray.300"
                textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
              >
                Tags
              </FormLabel>
              <HStack wrap="wrap" spacing={2} mb={2}>
                {formData.tags.map((tag) => (
                  <Tag
                    key={tag}
                    size="md"
                    bg="blue.900"
                    border="1px solid"
                    borderColor="blue.900"
                    color="white"
                    _hover={{
                      bg: "blue.800",
                      boxShadow: "0 0 3px rgba(66, 153, 225, 0.3)",
                    }}
                    transition="all 0.2s"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton
                      onClick={() => handleRemoveTag(tag)}
                      color="white"
                    />
                  </Tag>
                ))}
              </HStack>
              <InputGroup>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., Spanish)"
                  maxLength={50}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  bg="gray.700"
                  color="white"
                  borderColor="blue.900"
                  _hover={{ borderColor: "blue.800", transform: "scale(1.01)" }}
                  _focus={{
                    borderColor: "blue.700",
                    boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                    transform: "scale(1.01)",
                  }}
                  _placeholder={{ color: "gray.500" }}
                  transition="all 0.2s"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    bg="red.800"
                    border="1px solid"
                    borderColor="blue.900"
                    color="white"
                    _hover={{
                      bg: "red.700",
                      boxShadow: "0 0 3px rgba(66, 153, 225, 0.3)",
                    }}
                    _active={{ bg: "red.900" }}
                    transition="all 0.2s"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.tags && (
                <ChakraText color="red.400" fontSize="sm" mt={1}>
                  {errors.tags}
                </ChakraText>
              )}
            </FormControl>

            <HStack spacing={4} justify="flex-end">
              <Button
                bg="gray.700"
                border="2px solid"
                borderColor="blue.900"
                color="white"
                _hover={{
                  bg: "gray.600",
                  boxShadow: "0 0 5px rgba(66, 153, 225, 0.3)",
                  transform: "scale(1.02)",
                }}
                _active={{ bg: "gray.800" }}
                transition="all 0.2s"
                onClick={() => router.push(`/dashboard/decks`)}
                isDisabled={isSubmitting}
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
                isLoading={isSubmitting}
                loadingText="Saving..."
                spinner={<Spinner color="white" />}
              >
                Save Changes
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}