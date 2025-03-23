"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Deck {
  id: string;
  title: string;
  cardCount: number;
}

export default function SearchDecksPage() {
  const { tokens, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSearch = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/personal-vocab/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Search failed: ${res.statusText}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Search Decks
      </Heading>
      <VStack align="stretch" spacing={4}>
        <Box display="flex" gap={2}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for decks..."
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            colorScheme="teal"
            onClick={handleSearch}
            isLoading={loading}
          >
            Search
          </Button>
        </Box>
        {results.length > 0 ? (
          results.map((deck) => (
            <Box
              key={deck.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", cursor: "pointer" }}
              onClick={() => router.push(`/dashboard/decks/${deck.id}`)}
            >
              <Text fontSize="lg" fontWeight="bold">
                {deck.title}
              </Text>
              <Text color="gray.600">{deck.cardCount} cards</Text>
            </Box>
          ))
        ) : (
          <Text>No results found.</Text>
        )}
      </VStack>
    </Box>
  );
}