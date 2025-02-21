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
      <div className="flex flex-col justify-center w-96 h-80 bg-opacity-5 overflow-hidden  px-1 py-2    rounded-md cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105">
        <img
          src={imageUrl || defaultImg}
          alt={title}
          className="w-96 h-60 object-cover rounded-md"
        />
        <div className="flex flex-col gap-2 p-2">
          <h2 className="mt-2 text-base font-bold text-gray-200">{title}</h2>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default DeckCard;
