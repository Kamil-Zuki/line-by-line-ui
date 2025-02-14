// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newDeck: {
    title: string;
    description: string;
    imageUrl: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const deckModal = ({
  isOpen,
  onClose,
  onSubmit,
  newDeck,
  onChange,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-black text-xl font-semibold mb-4">
          Create New Deck
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newDeck.title}
              onChange={onChange}
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newDeck.description}
              onChange={onChange}
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={newDeck.imageUrl}
              onChange={onChange}
              className="text-black w-full p-2 mt-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
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

export default deckModal;
