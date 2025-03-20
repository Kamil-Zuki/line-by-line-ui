import { NextRequest, NextResponse } from "next/server";
import { decks } from "@/app/lib/mockData";
import { authMiddleware } from "@/app/lib/authMiddleware";

export async function GET(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const userDecks = decks.filter((deck) => deck.userId === userId);
  return NextResponse.json(userDecks);
}

export async function POST(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const newDeck = {
    id: String(decks.length + 1),
    title,
    cardCount: 0,
    userId,
  };
  decks.push(newDeck);
  return NextResponse.json(newDeck, { status: 201 });
}
