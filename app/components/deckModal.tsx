// components/deckModal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newDeck: { title: string; description: string; imageUrl: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const DeckModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newDeck,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-black text-2xl font-bold mb-4">Create New Deck</h2>

        <form>
          <div className="mb-4">
            <label className="text-black block mb-2">Deck Title</label>
            <input
              type="text"
              name="title"
              value={newDeck.title}
              onChange={onChange}
              className="text-black w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="text-black block mb-2">Deck Description</label>
            <textarea
              name="description"
              value={newDeck.description}
              onChange={onChange}
              className="text-black w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="text-black block mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={newDeck.imageUrl}
              onChange={onChange}
              className="text-black w-full p-2 border rounded-md"
            />
          </div>

          <div className="text-black flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeckModal;
