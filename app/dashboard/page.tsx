"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "@/app/hooks/useAuth";
import { fetchApi, DeckResponse } from "@/app/lib/api";

interface Stats {
  deckCount: number;
  totalCards: number; // Placeholder until backend provides cardCount
}

export default function DashboardPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchStats = async () => {
      try {
        const decks: DeckResponse[] = await fetchApi("/decks/my-decks");
        const deckCount = decks.length;
        // Note: cardCount isn’t in DeckResponse yet; assuming 0 for now
        const totalCards = decks.reduce((sum) => sum, 0); // Placeholder
        setStats({ deckCount, totalCards });
      } catch (error: any) {
        console.error("Error fetching stats:", error.message, {
          status: error.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, authLoading]);

  if (authLoading || !isAuthenticated) return null; // Middleware redirects to /login
  if (loading) return <Text>Loading dashboard...</Text>;

  return (
    <Box p={6}>
      <Heading size="lg">Welcome, {user?.userName}!</Heading>
      {stats ? (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Your Stats
          </Text>
          <Text>Decks: {stats.deckCount}</Text>
          <Text>Total Cards: {stats.totalCards} (Pending backend update)</Text>
        </Box>
      ) : (
        <Text mt={4}>No stats available yet.</Text>
      )}
    </Box>
  );
}
