// app/dashboard/decks/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { Deck } from "@/app/interfaces";

export default function DeckPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const [token, setToken] = useState<string | null>(null);
  const params = use(paramsPromise);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  //Handle token
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

  //Handle decks fetching
  useEffect(() => {
    if (!token) {
      return;
    }
    fetchDeck();
  }, [token]);

  const fetchDeck = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/personal-vocab/decks/${params.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch deck");
      }
      const data = await response.json();
      setDeck(data);
      if (!data) {
      }
    } catch (err) {
      setError("Failed to fetch decks.");
    } finally {
      setLoading(false);
    }
  };

  const updateDeck = async () => {
    if (!token || !editingDeck) {
      setError("Log in to update deck");
      return;
    }
    console.log(editingDeck);
    try {
      const response = await fetch(`/api/personal-vocab/decks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingDeck),
      });
      if (!response.ok) throw new Error("Failed to update deck");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteDeck = async (id: string) => {
    if (!token) {
      setError("Please log in to delete a deck.");
      return;
    }
    const answer = confirm(
      "Are you sure you want to delete the deck? Related cards will be eliminated"
    );
    if (!answer) return;
    try {
      const response = await fetch(`/api/personal-vocab/decks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete deck");

      router.push(`/dashboard/decks/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Deck not found"}</p>
        <Link
          href="/dashboard/decks"
          className="mt-4 text-blue-500 hover:underline"
        >
          Go back to decks
        </Link>
      </div>
    );
  }
  let defaultImg = "/kakashi.jpg";
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6 border shadow-white">
        {editingDeck?.id === deck.id ? (
          <form
            onSubmit={updateDeck}
            className="flex flex-col gap-2 text-black"
          >
            <p className="text-black text-xl">Edit deck</p>
            <input
              type="text"
              placeholder="Title"
              value={editingDeck.title}
              onChange={(e) =>
                setEditingDeck({ ...editingDeck, title: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={editingDeck.description}
              onChange={(e) =>
                setEditingDeck({ ...editingDeck, description: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Image url"
              className="border p-2 rounded"
              onChange={(e) =>
                setEditingDeck({ ...editingDeck, imageUrl: e.target.value })
              }
              value={editingDeck.imageUrl}
            />
            <div className="mt-2 space-x-2">
              <button
                type="submit"
                className="bg-green-500 p-2 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingDeck(null)}
                className="bg-gray-500 p-2 text-white  rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="relative w-full h-64 mb-4">
              <Image
                src={deck.imageUrl || defaultImg}
                alt={`${deck.title} deck cover`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-lg"
                priority
              />
            </div>
            <h1 className="text-black text-2xl font-bold mb-2">{deck.title}</h1>
            <p className="text-black mb-4">{deck.description}</p>
            <div className="flex flex-col gap-4">
              <button
                aria-label={`Start learning ${deck.title} deck`}
                onClick={() =>
                  router.push(`/dashboard/decks/${params.id}/learn`)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Start Learning
              </button>

              <button
                aria-label={`Create cards for ${deck.title} deck`}
                onClick={() =>
                  router.push(`/dashboard/decks/${params.id}/cards`)
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                View Cards
              </button>
              <div className="flex justify-center gap-2 flex-row flex-auto">
                <button
                  onClick={() => setEditingDeck(deck)}
                  className="bg-yellow-500 text-white w-1/6 p-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDeck(deck.id)}
                  className=" bg-red-500 text-white w-1/6 p-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
        {/* Deck */}

        {/* Buttons */}
      </div>
    </div>
  );
}
