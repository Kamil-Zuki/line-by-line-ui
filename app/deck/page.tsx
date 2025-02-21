"use client";
import React, { useEffect, useState } from "react";
import DeckModal from "../components/DeckModal";
import DeckCard from "../components/DeckCard";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  groupId: string;
}

export default function DeckPage() {
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
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setDecks(
          data.map((deck: any) => ({
            id: deck.id,
            title: deck.title, // ✅ Now using "title" from API response
            description: deck.description || "No description available",
            imageUrl: deck.imageUrl || "/kakashi.jpg",
            groupId: deck.groupId,
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewDeck((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDeck = async () => {
    if (!newDeck.title.trim()) {
      alert("Deck title is required!");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }

    try {
      console.log(newDeck);

      const response = await fetch("/api/personal-vocab/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newDeck.title, // ✅ Ensuring we send "title" instead of "name"
          description: newDeck.description,
          imageUrl: newDeck.imageUrl || "/kakashi.jpg",
          groupId: newDeck.groupId,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const createdDeck = await response.json();
      setDecks((prevDecks) => [
        ...prevDecks,
        {
          id: createdDeck.id,
          title: createdDeck.title, // ✅ Ensuring we use "title" from API response
          description: createdDeck.description || "No description available",
          imageUrl: newDeck.imageUrl || "/kakashi.jpg",
          groupId: createdDeck.groupId,
        },
      ]);

      setNewDeck({
        title: "",
        description: "",
        imageUrl: "",
        groupId: "bcdae31d-148e-4df6-8fa5-01399472d5c0",
      });

      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deck.");
    }
  };

  return (
    <div className="flex flex-col">
      {loading && <p className="text-center text-gray-500">Loading decks...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <button
        className="w-32 mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleOpenModal}
      >
        Create Deck
      </button>

      <DeckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateDeck}
        newDeck={newDeck}
        onChange={handleChange}
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
