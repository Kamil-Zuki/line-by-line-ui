"use client";
import React from "react";
import Link from "next/link";

interface DeckCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

const DeckCard: React.FC<DeckCardProps> = ({
  id,
  title,
  description,
  imageUrl,
}) => {
  let defaultImg = "/kakashi.jpg";
  return (
    <Link href={`/deck/${id}`} passHref>
      <div className="w-64 p-4 bg-white shadow-lg rounded-md cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105">
        <img
          src={imageUrl || defaultImg}
          alt={title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="mt-2 text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default DeckCard;
