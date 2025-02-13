// components/DeckList.tsx
import { Deck } from "../interfaces";
import CreateCardForm from "./createCardForm.tsx";

interface DeckListProps {
  decks: Deck[];
  onAddCard: (deckId: string, content: string) => void;
}

const DeckList: React.FC<DeckListProps> = ({ decks, onAddCard }) => {
  return (
    <div className="space-y-6">
      {decks.map((deck) => (
        <div key={deck.id} className="border-b pb-6">
          <h2 className="text-2xl font-bold mb-4">{deck.name}</h2>
          <CreateCardForm deckId={deck.id} onCreateCard={onAddCard} />
          <ul>
            {deck.cards.map((card) => (
              <li
                key={card.id}
                className="border p-4 mb-4 bg-white rounded-lg shadow-sm"
              >
                <p>{card.content}</p>
                <p className="text-sm text-gray-500">
                  Next Review: {card.nextReviewDate.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DeckList;
