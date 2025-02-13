"use client";
import React, { useState } from 'react';
import DeckCard from '../components/deckCard';

interface DeckCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export default function Deck() {
  const [decks, setDecks] = useState<DeckCardProps[]>([
    { title: 'French Basics', description: 'Learn basic French', imageUrl: '/kakashi.jpg' },
    { title: 'Spanish Intermediate', description: 'Improve your Spanish', imageUrl: '/kakashi.jpg' }
  ]);

  const createDeck = () => {
    const newDeck: DeckCardProps = {
      title: `New Deck ${decks.length + 1}`,
      description: 'New deck description',
      // imageUrl: 'https://via.placeholder.com/256x144.png?text=New+Deck'
    };
    setDecks([...decks, newDeck]);
  };

  return (
    <div className="container mx-auto px-4 py-1">
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={createDeck}>Create Deck</button>
      <div className="flex flex-wrap gap-4 justify-start">
        {decks.map((deck, index) => (
          <DeckCard key={index} {...deck} />
        ))}
      </div>
    </div>
  );
}
