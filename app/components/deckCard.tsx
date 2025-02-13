import React from 'react';

interface DeckCardProps {
    title: string;
    description: string;
    imageUrl?: string;
  }
  
  export default function DeckCard({ title, description, imageUrl }: DeckCardProps) {
    const defaultImage = '/kakashi.jpg';
    return (
      <div className="relative w-64 h-48 rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
        <img src={imageUrl ?? defaultImage} alt={title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white text-lg font-semibold truncate">{title}</h3>
          <p className="text-gray-300 text-sm truncate">{description}</p>
        </div>
      </div>
    );
  }
// Usage example:
// <DeckCard title="French Basics" description="100 cards to learn basics" imageUrl="/path/to/image.jpg" />
