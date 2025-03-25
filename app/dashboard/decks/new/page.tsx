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

  if (loading) return <Box>Loading...</Box>;
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting deck creation:", form);
      const deck = await api.post<{ id: string }>("/decks", form);
      console.log("Deck created successfully:", deck);
      router.push(`/dashboard/decks/${deck.id}`);
    } catch (error: any) {
      console.error("Error creating deck:", error.message);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Create a New Deck</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormControl>
          <Checkbox
            isChecked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          >
            Make Public
          </Checkbox>
          <Button type="submit" colorScheme="teal">
            Create Deck
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
