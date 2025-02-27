// app/dashboard/decks/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import DeckCard from "@/app/components/DeckCard";

interface Deck {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  groupId: string;
}

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

  useEffect(() => {
    if (!token) {
      return;
    }
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
      } catch (err) {
        setError("Failed to fetch decks.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-neutral-900 shadow-md rounded-lg p-6">
        <div className="relative w-full h-64 mb-4">
          <Image
            src={deck.imageUrl}
            alt={`${deck.title} deck cover`}
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{deck.title}</h1>
        <p className="text-gray-300 mb-4">{deck.description}</p>

        <div className="flex flex-col gap-4">
          <button
            aria-label={`Start learning ${deck.title} deck`}
            onClick={() => router.push(`/dashboard/decks/${params.id}/learn`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </button>

          <button
            aria-label={`Create cards for ${deck.title} deck`}
            onClick={() => router.push(`/dashboard/decks/${params.id}/cards`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Create Cards
          </button>

          <Link
            href="/dashboard/decks"
            className="text-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Decks
          </Link>
        </div>
      </div>
    </div>
  );
}
