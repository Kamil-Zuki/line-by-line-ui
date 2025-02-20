"use client";
import React, { useState } from "react";
import DeckModal from "../components/DeckModal"; // Modal for deck creation
import DeckCard from "../components/DeckCard"; // Card for each deck

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function DeckPage() {
  const [decks, setDecks] = useState<DeckCardProps[]>([
    {
      id: "1",
      title: "French Basics",
      description: "Learn basic French",
      imageUrl: "/kakashi.jpg",
    },
    {
      id: "2",
      title: "Spanish Intermediate",
      description: "Improve your Spanish",
      imageUrl: "/kakashi.jpg",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newDeck, setNewDeck] = useState<DeckCardProps>({
    id: "",
    title: "",
    description: "",
    imageUrl: "/kakashi.jpg", // Default image
  });

  // Create new deck function
  const createDeck = () => {
    const newDeckItem: DeckCardProps = {
      ...newDeck,
      id: (decks.length + 1).toString(), // Generate a new ID
    };
    setDecks([...decks, newDeckItem]); // Add the new deck to the list
    setShowModal(false); // Close modal after adding the deck
  };

  // Handle input changes in modal
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDeck({
      ...newDeck,
      [e.target.name]: e.target.value, // Update newDeck state dynamically
    });
  };

  return (
    <div className="container">
      <button
        className="mb-4 bg-blue-600 text-white px-3 py-1 rounded "
        onClick={() => setShowModal(true)} // Show modal on button click
      >
        Create Deck
      </button>
      <div className="flex flex-wrap gap-4 justify-start">
        {decks.map((deck) => (
          <DeckCard key={deck.id} {...deck} /> // Render deck cards
        ))}
      </div>

      <DeckModal
        isOpen={showModal}
        onClose={() => setShowModal(false)} // Close modal
        onSubmit={createDeck} // Submit the new deck
        newDeck={newDeck} // Pass the newDeck data to modal
        onChange={handleChange} // Pass change handler for modal inputs
      />
    </div>
  );
}
