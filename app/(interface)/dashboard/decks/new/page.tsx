"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  VStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useApi } from "@/app/lib/api";

export default function NewDeck() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [form, setForm] = useState({
    title: "",
    description: "",
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner
          size="xl"
          color="white"
          thickness="3px"
          speed="0.65s"
          _hover={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
        />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Submitting deck creation:", form);
      const deck = await api.post<{ id: string }>("/deck", form);
      console.log("Deck created successfully:", deck);
      router.push(`/dashboard/decks/${deck.id}`);
    } catch (error: any) {
      console.error("Error creating deck:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      maxW="600px"
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
      <Heading
        as="h1"
        size={{ base: "lg", md: "xl" }}
        mb={6}
        color="white"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 5px rgba(66, 153, 225, 0.3)" // Soft blue glow
        textAlign="center"
        fontWeight="bold"
      >
        Create a New Deck
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} position="relative" zIndex={3}>
          <FormControl isRequired>
            <FormLabel
              color="gray.300"
              textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
            >
              Title
            </FormLabel>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          <FormControl>
            <FormLabel
              color="gray.300"
              textShadow="1px 1px 1px rgba(0, 0, 0, 0.5)"
            >
              Description
            </FormLabel>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
          <Checkbox
            isChecked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
            colorScheme="blue"
            borderColor="blue.900"
            _hover={{ borderColor: "blue.800", boxShadow: "0 0 3px rgba(66, 153, 225, 0.2)" }}
            sx={{
              ".chakra-checkbox__control": {
                borderColor: "blue.900",
                _checked: {
                  bg: "blue.900",
                  borderColor: "blue.700",
                  boxShadow: "0 0 3px rgba(66, 153, 225, 0.3)",
                },
              },
              ".chakra-checkbox__label": {
                color: "gray.300",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            Make Public
          </Checkbox>
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
            isLoading={isSubmitting}
            loadingText="Creating..."
            spinner={<Spinner color="white" />}
            transition="all 0.2s"
          >
            Create Deck
          </Button>
        </VStack>
      </form>
    </Box>
  );
}