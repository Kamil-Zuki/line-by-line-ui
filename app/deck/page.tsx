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
      console.log(token);
      if (!token) {
        setError("Authorization token not found. Please log in.");
        setLoading(false);
        return;
      }
      console.log(token);
      try {
        const response = await fetch("http://85.175.218.17/api/v1/deck", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const formattedDecks = data.map((deck: any) => ({
          id: deck.id,
          title: deck.name,
          description: "No description available", // Adjust if API provides it
          imageUrl: "/kakashi.jpg", // Default image
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
      {loading && <p>Loading decks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        className="mb-4 bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => alert("Deck creation not implemented yet")} // Replace with modal logic
      >
        Create Deck
      </button>

      <div className="flex flex-wrap gap-4 justify-start">
        {decks.length > 0
          ? decks.map((deck) => <DeckCard key={deck.id} {...deck} />)
          : !loading && <p>No decks available.</p>}
      </div>
    </div>
  );
}
