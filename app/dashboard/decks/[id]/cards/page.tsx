"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { Card, Deck } from "@/app/interfaces";

export default function CardsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string}>;
}) {
  const params = use(paramsPromise);
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    text: "",
    transcription: "",
    meaning: "",
    example: "",
    image: "",
    deckId: params.id,
  });
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const router = useRouter();

  // Fetch token on mount (your specified logic)
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/token");
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError("Authorization token not found. Please log in.");
      }
    };

    fetchToken();
  }, []);

  // Fetch cards once token is available
  useEffect(() => {
    if (!token) return; // Wait for token before fetching cards

    const fetchDeck = async () => {
      try{
        const response = await fetch(
          `/api/personal-vocab/decks/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch the deck");
        const data = await response.json();
        setDeck(data);
      }
      catch(err){
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/personal-vocab/cards/deck/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch cards");
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
    fetchCards();
  }, [params.id, token]);

  const createCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to create a card.");
      return;
    }
    try {
      const response = await fetch("/api/personal-vocab/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCard),
      });
      if (!response.ok) throw new Error("Failed to create card");
      setNewCard({
        text: "",
        transcription: "",
        meaning: "",
        example: "",
        image: "",
        deckId: params.id,
      });
      fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingCard) {
      setError("Please log in to update a card.");
      return;
    }
    try {
      const response = await fetch(
        `/api/personal-vocab/cards/${editingCard.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingCard),
        }
      );
      if (!response.ok) throw new Error("Failed to update card");
      setEditingCard(null);
      fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteCard = async (id: string) => {
    if (!token) {
      setError("Please log in to delete a card.");
      return;
    }
    try {
      const response = await fetch(`/api/personal-vocab/cards/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete card");
      fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchCards = async () => {
    try {
      const response = await fetch(
        `/api/personal-vocab/cards/deck/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch cards");
      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        {error}{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link
        href={`/dashboard/decks/${params.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Deck
      </Link>
      <h1 className="text-white text-2xl font-bold mb-4">
        Manage Cards for Deck <p className="text-lime-400">{deck?.title || ""}</p>
      </h1>

      {/* Create Card Form */}
      <form onSubmit={createCard} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Text"
            value={newCard.text}
            onChange={(e) => setNewCard({ ...newCard, text: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Transcription"
            value={newCard.transcription}
            onChange={(e) =>
              setNewCard({ ...newCard, transcription: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Meaning"
            value={newCard.meaning}
            onChange={(e) =>
              setNewCard({ ...newCard, meaning: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Example"
            value={newCard.example}
            onChange={(e) =>
              setNewCard({ ...newCard, example: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={newCard.image}
            onChange={(e) => setNewCard({ ...newCard, image: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Card
        </button>
      </form>


      {/* Cards List */}
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            {editingCard?.id === card.id ? (
              <form onSubmit={updateCard} className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingCard.text}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, text: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingCard.transcription}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        transcription: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingCard.meaning}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        meaning: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingCard.example}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        example: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="url"
                    value={editingCard.image}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, image: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                </div>
                <div className="mt-2 space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCard(null)}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex w-full flex-row justify-between items-center">
                <div>
                  <h3 className="font-bold">{card.text}</h3>
                  <p className="text-emerald-500">{card.transcription}</p>
                  <p>{card.meaning}</p>
                  <p>{card.example}</p>
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.text}
                      className="w-20 h-20 object-cover mt-2"
                    />
                  )}
                </div>
                <div className="flex gap-1 w-1/6 justify-end">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
