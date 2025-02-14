// components/Deck.tsx
"use client";
import React, { useState } from "react";
import Modal from "../components/deckModal";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const DeckCard = ({ title, description, imageUrl }: DeckCardProps) => {
  const defaultImage = "/kakashi.jpg";
  return (
    <div className="relative w-64 h-36 rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
      <img
        src={imageUrl || defaultImage}
        alt={title}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white text-lg font-semibold truncate">{title}</h3>
        <p className="text-gray-300 text-sm truncate">{description}</p>
      </div>
    </div>
  );
};

export default function Deck() {
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
    imageUrl: "/kakashi.jpg",
  });

  const createDeck = () => {
    const newDeckItem: DeckCardProps = {
      ...newDeck,
      id: (decks.length + 1).toString(),
    };
    setDecks([...decks, newDeckItem]);
    setShowModal(false); // Close the modal after adding the deck
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDeck({
      ...newDeck,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Create Deck
      </button>
      <div className="flex flex-wrap gap-4 justify-start">
        {decks.map((deck) => (
          <DeckCard key={deck.id} {...deck} />
        ))}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={createDeck}
        newDeck={newDeck}
        onChange={handleChange}
      />
    </div>
  );
}
