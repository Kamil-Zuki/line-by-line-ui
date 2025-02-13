// deck/page.tsx
"use client";
import { useState } from "react";
import CreateDeckForm from "../components/createDeckForm";
import DeckList from "../components/deckList";
import { Deck, Card } from "../interfaces";

const HomePage = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  const handleCreateDeck = (name: string) => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name,
      cards: [],
    };
    setDecks((prev) => [...prev, newDeck]);
  };

  // Handle creation of a card
  const handleCreateCard = (deckId: string, content: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      content,
      nextReviewDate: new Date(Date.now() + 86400000), // 1 day from now
      interval: 1,
    };
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === deckId ? { ...deck, cards: [...deck.cards, newCard] } : deck
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8">Language Learning Decks</h1>
      <CreateDeckForm onCreateDeck={handleCreateDeck} />
      <DeckList decks={decks} onAddCard={handleCreateCard} />
    </div>
  );
};

export default HomePage;
