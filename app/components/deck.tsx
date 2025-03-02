// components/Deck.tsx
"use client";
import React, { useState } from "react";
import DeckModal from "./DeckModal";
import DeckCard from "./DeckCard";


// Define interface for deck properties
interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  groupId: string;
}

export default function Deck() {
  // State for the decks list
  const [decks, setDecks] = useState<DeckCardProps[]>([]);

  // State for managing modal visibility
  const [showModal, setShowModal] = useState(false);

  // State for the new deck's properties
  const [newDeck, setNewDeck] = useState<DeckCardProps>({
    id: "",
    title: "",
    description: "",
    imageUrl: "/kakashi.jpg", // Default image for new decks
    groupId: "",
  });

  // Function to handle deck creation
  const createDeck = () => {
    const newDeckItem: DeckCardProps = {
      ...newDeck,
      id: (decks.length + 1).toString(), // Assign unique ID
    };
    setDecks([...decks, newDeckItem]); // Add the new deck to the list
    setShowModal(false); // Close modal after adding the deck
  };

  // Handle changes to the new deck form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDeck({
      ...newDeck,
      [e.target.name]: e.target.value, // Update the new deck with the input values
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Button to open the modal for creating a new deck */}
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Create Deck
      </button>

      {/* Display deck cards */}
      <div className="flex flex-wrap gap-4 justify-start">
        {decks.map((deck) => (
          <DeckCard key={deck.id} {...deck} /> // Render deck card for each deck in the list
        ))}
      </div>

      {/* Modal Component for deck creation */}
      <DeckModal
        isOpen={showModal} // Modal visibility state
        onClose={() => setShowModal(false)} // Close modal function
        onSubmit={createDeck} // Submit new deck function
        newDeck={newDeck} // Pass current new deck data to modal
        onChange={handleChange} // Pass input change handler to modal
      />
    </div>
  );
}
