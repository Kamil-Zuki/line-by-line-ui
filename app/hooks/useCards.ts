import { useState, useEffect } from "react";
import { CardTableRow } from "@/app/types/card";

export const useCards = () => {
  const [cards, setCards] = useState<CardTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/personal-vocab/card/all", { credentials: "include" });

        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }

        const data: CardTableRow[] = await response.json();
        setCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
};