"use client";
import DeckCard from "@/app/components/DeckCard";
import DeckModal from "@/app/components/DeckModal";
import React, { useEffect, useState } from "react";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  groupId: string;
}

export default function DeckPage() {
  const [token, setToken] = useState<string | null>(null);
  const [decks, setDecks] = useState<DeckCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeck, setNewDeck] = useState({
    title: "",
    description: "",
    imageUrl: "",
    groupId: "c5c37f10-c417-4171-893e-3c2eadf77782",
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/token");
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError("Authorization token not found. Please log in.");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchDecks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/personal-vocab/decks", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error fetching decks");

        const data = await response.json();
        setDecks(
          data.map((deck: any) => ({
            id: deck.id,
            title: deck.title,
            description: deck.description || "No description available",
            imageUrl: deck.imageUrl || "/kakashi.jpg",
            groupId: deck.groupId,
          }))
        );
      } catch (err) {
        setError("Failed to fetch decks.");
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [token]);

  const handleCreateDeck = async () => {
    if (!newDeck.title.trim()) {
      alert("Deck title is required!");
      return;
    }

    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("/api/personal-vocab/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDeck),
      });

      if (!response.ok) throw new Error("Failed to create deck");

      const createdDeck = await response.json();
      setDecks([...decks, createdDeck]);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to create deck.");
    }
  };

  return (
    <div className="flex flex-col">
      {loading && <p className="text-center text-gray-500">Loading decks...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <button
        className="w-32 mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setIsModalOpen(true)}
      >
        Create Deck
      </button>

      <DeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeck}
        newDeck={newDeck}
        onChange={(e) =>
          setNewDeck({ ...newDeck, [e.target.name]: e.target.value })
        }
      />

      <div className="flex gap-4 w-auto justify-start items-center flex-wrap">
        {decks.length > 0
          ? decks.map((deck) => <DeckCard key={deck.id} {...deck} />)
          : !loading && (
              <p className="text-center text-gray-500">No decks available.</p>
            )}
      </div>
    </div>
  );
}
