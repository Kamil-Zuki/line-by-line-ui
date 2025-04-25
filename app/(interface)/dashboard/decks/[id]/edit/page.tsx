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
  Text,
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

  // Unwrap params using React.use
  const { id } = React.use(params);

  // Fetch deck details
  useEffect(() => {
    const fetchDeck = async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi<DeckResponse>(`/deck/${id}`);
        if (response.ownerId !== user?.id) {
          toast({
            title: "Access Denied",
            description: "You can only edit your own decks.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
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
        toast({
          title: "Error",
          description: "Failed to load deck. Please try again.",
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
      fetchDeck();
    }
  }, [isAuthenticated, authLoading, user, id, router, toast]);

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
      toast({
        title: "Success",
        description: "Deck updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/dashboard/decks`);
    } catch (error: any) {
      console.error("Error updating deck:", error.message, {
        status: error.status,
      });
      toast({
        title: "Error",
        description: "Failed to update deck. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (!deck) {
    return null; // Redirect handled in useEffect
  }

  return (
    <Box p={{ base: 4, md: 6 }} maxW="800px" mx="auto">
      <Heading as="h1" size="lg" mb={6}>
        Edit Deck: {deck.title}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.title} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter deck title"
              maxLength={100}
            />
            {errors.title && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.title}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter deck description (optional)"
              maxLength={500}
              rows={4}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0}>Public</FormLabel>
            <Switch
              isChecked={formData.isPublic}
              onChange={handleTogglePublic}
              colorScheme="teal"
            />
          </FormControl>

          <FormControl isInvalid={!!errors.tags}>
            <FormLabel>Tags</FormLabel>
            <HStack wrap="wrap" spacing={2} mb={2}>
              {formData.tags.map((tag) => (
                <Tag key={tag} size="md" variant="solid" colorScheme="teal">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
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
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleAddTag}
                  colorScheme="teal"
                >
                  Add
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.tags && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.tags}
              </Text>
            )}
          </FormControl>

          <HStack spacing={4} justify="flex-end">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/decks`)}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
