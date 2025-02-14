import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const DeckCard = ({ id, title, description, imageUrl }: DeckCardProps) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set isClient to true once the component is mounted on the client
    setIsClient(true);
  }, []);

  // Prevent rendering until the component is mounted in the browser
  if (!isClient) {
    return null;
  }

  const navigateToDeck = () => {
    router.push(`/learn/${id}`); // Or use router.push for navigating to a specific deck
  };

  return (
    <div
      className="relative w-64 h-36 rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform cursor-pointer"
      onClick={navigateToDeck}
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

export default DeckCard;
