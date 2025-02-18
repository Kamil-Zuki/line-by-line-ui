// pages/learn/[deckId].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LearningDeck from "../components/LearningDeck";

const LearnDeckPage = () => {
  const router = useRouter();

  // Use state to track if the component has mounted (to avoid SSR issues)
  const [isClient, setIsClient] = useState(false);

  // Only run this in the browser
  useEffect(() => {
    setIsClient(true); // Component is mounted, so we can safely use the router
  }, []);

  // Don't render the page until it's client-side
  if (!isClient) {
    return null;
  }

  const { deckId } = router.query;

  // Simulated deck data (replace with dynamic data or state management)
  const decks = [
    {
      id: "1",
      title: "French Basics",
      description: "Learn basic French",
      cards: [
        { front: "What is 2 + 2?", back: "4" },
        { front: "What is the capital of France?", back: "Paris" },
        { front: "What is the color of the sky?", back: "Blue" },
      ],
    },
    {
      id: "2",
      title: "Spanish Intermediate",
      description: "Improve your Spanish",
      cards: [
        { front: "What is 3 + 3?", back: "6" },
        { front: "What is the capital of Spain?", back: "Madrid" },
        { front: "What color is the grass?", back: "Green" },
      ],
    },
  ];

  const currentDeck = decks.find((deck) => deck.id === deckId);

  if (!currentDeck) return <div>Deck not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Learn: {currentDeck.title}
      </h1>
      <LearningDeck deckId={currentDeck.id} cards={currentDeck.cards} />
    </div>
  );
};

export default LearnDeckPage;
