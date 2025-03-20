"use client";

import { useState } from "react";
import { Box, Heading, Input, Button, useToast } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function NewDeckPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/personal-vocab/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create deck");
      toast({
        title: "Success",
        description: "Deck created",
        status: "success",
      });
      router.push("/dashboard/decks");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Create New Deck
      </Heading>
      <Input
        placeholder="Deck Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={4}
      />
      <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
        Create Deck
      </Button>
    </Box>
  );
}
