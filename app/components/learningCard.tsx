// components/LearningCard.tsx
import React from "react";
import { useRouter } from "next/router";

interface LearningCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cards: { front: string; back: string }[]; // Cards for the deck
}

const LearningCard = ({
  id,
  title,
  description,
  imageUrl,
  cards,
}: LearningCardProps) => {
  const router = useRouter();

  const handleOpenDeck = () => {
    router.push(`/learn/${id}`); // Redirect to the learning page for this deck
  };

  return (
    <div
      className="relative w-64 h-36 rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform cursor-pointer"
      onClick={handleOpenDeck}
    >
      <img
        src={imageUrl}
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

export default LearningCard;
