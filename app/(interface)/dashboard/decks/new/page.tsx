"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Flex, Spinner, useToast } from "@chakra-ui/react";
import FormCard from "@/app/components/ui/FormCard";
import NewDeckForm from "@/app/components/ui/NewDeckForm";
import { useAuth } from "@/app/hooks/useAuth";
import { useApi } from "@/app/lib/api";

export default function NewDeck() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const api = useApi();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <Flex justify="center" py={10}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (values: { title: string; description: string; isPublic: boolean }) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting deck creation:", values);
      const deck = await api.post<{ id: string }>("/deck", values);
      console.log("Deck created successfully:", deck);
      router.push(`/dashboard/decks/${deck.id}`);
    } catch (error: any) {
      console.error("Error creating deck:", error.message);
      toast({
        title: "Failed to create deck",
        description: error.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard>
      <Heading as="h1" size="lg" mb={6}>
        Create a new deck
      </Heading>
      <NewDeckForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </FormCard>
  );
}