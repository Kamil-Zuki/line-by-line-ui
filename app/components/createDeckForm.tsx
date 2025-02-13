// components/CreateDeckForm.tsx
import { useState } from "react";

interface CreateDeckFormProps {
  onCreateDeck: (name: string) => void;
}

const CreateDeckForm: React.FC<CreateDeckFormProps> = ({ onCreateDeck }) => {
  const [deckName, setDeckName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deckName.trim()) {
      onCreateDeck(deckName);
      setDeckName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
      <input
        type="text"
        placeholder="Deck Name"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Create Deck
      </button>
    </form>
  );
};

export default CreateDeckForm;
