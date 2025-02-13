// components/CreateCardForm.tsx
import { useState } from "react";

interface CreateCardFormProps {
  deckId: string;
  onCreateCard: (deckId: string, content: string) => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({
  deckId,
  onCreateCard,
}) => {
  const [cardContent, setCardContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardContent.trim()) {
      onCreateCard(deckId, cardContent);
      setCardContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
      <textarea
        placeholder="Card content"
        value={cardContent}
        onChange={(e) => setCardContent(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Add Card
      </button>
    </form>
  );
};

export default CreateCardForm;
