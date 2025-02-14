// components/deckCard.tsx
import React from "react";

// Define interface for deck card properties
interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const DeckCard: React.FC<DeckCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="w-64 p-4 bg-white shadow-lg rounded-md">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="mt-2 text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default DeckCard;
