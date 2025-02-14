// components/LearningDeck.tsx
import React, { useState } from "react";

interface Card {
  front: string; // Term or question
  back: string; // Definition or answer
}

interface LearningDeckProps {
  deckId: string;
  cards: Card[];
}

const LearningDeck = ({ deckId, cards }: LearningDeckProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<number[]>([]); // Store ratings for each card

  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state for next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert("You have finished all cards!");
      // Optionally, reset or close the learning session
    }
  };

  const handleRating = (rating: number) => {
    // Store the rating for the current card
    setRatings([...ratings, rating]);
    handleNextCard();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Deck: {deckId}</h2>

        <div className="flex justify-center mb-4">
          <div
            className="w-64 h-36 flex items-center justify-center bg-gray-200 rounded-xl cursor-pointer"
            onClick={handleFlip}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {isFlipped ? currentCard.back : currentCard.front}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleNextCard}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next Card
          </button>

          <div>
            <button
              onClick={() => handleRating(1)}
              className="bg-red-600 text-white px-2 py-1 rounded mr-2"
            >
              Hard
            </button>
            <button
              onClick={() => handleRating(2)}
              className="bg-yellow-600 text-white px-2 py-1 rounded mr-2"
            >
              Medium
            </button>
            <button
              onClick={() => handleRating(3)}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              Easy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDeck;
