"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";

interface Term {
  id: string;
  text: string;
  transcription: string;
  meaning: string;
  example: string;
  image: string;
  deckId: string;
}

export default function CardsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [newTerm, setNewTerm] = useState({
    text: "",
    transcription: "",
    meaning: "",
    example: "",
    image: "",
    deckId: params.id,
  });
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const router = useRouter();

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/token", {
          credentials: "include", // Include cookies if token is session-based
        });
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError("Authorization token not found. Please log in.");
        router.push("/login"); // Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [router]); // Include router in dependencies for redirection

  // Fetch terms once token is available
  useEffect(() => {
    if (!token) return; // Wait for token before fetching terms

    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/terms/deck/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch terms");
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [params.id, token]); // Re-run if deck ID or token changes

  const createTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to create a term.");
      return;
    }
    try {
      const response = await fetch("/api/personal-vocab/terms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTerm),
      });
      if (!response.ok) throw new Error("Failed to create term");
      setNewTerm({
        text: "",
        transcription: "",
        meaning: "",
        example: "",
        image: "",
        deckId: params.id,
      });
      fetchTerms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTerm) {
      setError("Please log in to update a term.");
      return;
    }
    try {
      const response = await fetch(
        `/api/personal-vocab/terms/${editingTerm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingTerm),
        }
      );
      if (!response.ok) throw new Error("Failed to update term");
      setEditingTerm(null);
      fetchTerms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteTerm = async (id: string) => {
    if (!token) {
      setError("Please log in to delete a term.");
      return;
    }
    try {
      const response = await fetch(`/api/personal-vocab/terms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete term");
      fetchTerms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await fetch(
        `/api/personal-vocab/terms/deck/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch terms");
      const data = await response.json();
      setTerms(data);
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
      <h1 className="text-2xl font-bold mb-4">
        Manage Terms for Deck {params.id}
      </h1>

      {/* Create Term Form */}
      <form onSubmit={createTerm} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Term</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Text"
            value={newTerm.text}
            onChange={(e) => setNewTerm({ ...newTerm, text: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Transcription"
            value={newTerm.transcription}
            onChange={(e) =>
              setNewTerm({ ...newTerm, transcription: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Meaning"
            value={newTerm.meaning}
            onChange={(e) =>
              setNewTerm({ ...newTerm, meaning: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Example"
            value={newTerm.example}
            onChange={(e) =>
              setNewTerm({ ...newTerm, example: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="url"
            placeholder="Image URL"
            value={newTerm.image}
            onChange={(e) => setNewTerm({ ...newTerm, image: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Term
        </button>
      </form>

      {/* Terms List */}
      <div className="space-y-4">
        {terms.map((term) => (
          <div
            key={term.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            {editingTerm?.id === term.id ? (
              <form onSubmit={updateTerm} className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingTerm.text}
                    onChange={(e) =>
                      setEditingTerm({ ...editingTerm, text: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingTerm.transcription}
                    onChange={(e) =>
                      setEditingTerm({
                        ...editingTerm,
                        transcription: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingTerm.meaning}
                    onChange={(e) =>
                      setEditingTerm({
                        ...editingTerm,
                        meaning: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={editingTerm.example}
                    onChange={(e) =>
                      setEditingTerm({
                        ...editingTerm,
                        example: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="url"
                    value={editingTerm.image}
                    onChange={(e) =>
                      setEditingTerm({ ...editingTerm, image: e.target.value })
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
                    onClick={() => setEditingTerm(null)}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="font-bold">{term.text}</h3>
                  <p>{term.transcription}</p>
                  <p>{term.meaning}</p>
                  <p>{term.example}</p>
                  {term.image && (
                    <img
                      src={term.image}
                      alt={term.text}
                      className="w-20 h-20 object-cover mt-2"
                    />
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingTerm(term)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTerm(term.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Link
        href={`/dashboard/decks/${params.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Back to Deck
      </Link>
    </div>
  );
}
