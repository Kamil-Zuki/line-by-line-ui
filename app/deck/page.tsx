"use client";
import React, { useEffect, useState } from "react";
import DeckModal from "../components/DeckModal";
import DeckCard from "../components/DeckCard";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function DeckPage() {
  const [decks, setDecks] = useState<DeckCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDecks = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authorization token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/personal-vocab/decks", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // Send token to Next.js API
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const formattedDecks = data.map((deck: any) => ({
          id: deck.id,
          title: deck.name,
          description: deck.description || "No description available", // If API provides description
          imageUrl: "/kakashi.jpg",
        }));

        setDecks(formattedDecks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  return (
    <div className="container">
      {loading && <p className="text-center text-gray-500">Loading decks...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => alert("Deck creation not implemented yet")} // Replace with modal logic
      >
        Create Deck
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.length > 0
          ? decks.map((deck) => <DeckCard key={deck.id} {...deck} />)
          : !loading && (
              <p className="text-center text-gray-500">No decks available.</p>
            )}
      </div>
    </div>
  );
}
