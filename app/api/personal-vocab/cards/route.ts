import { NextRequest, NextResponse } from "next/server";
import { cards, decks } from "@/app/lib/mockData";
import { authMiddleware } from "@/app/lib/authMiddleware";

export async function GET(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const userCards = cards.filter((card) => card.userId === userId);
  return NextResponse.json(userCards);
}

export async function POST(req: NextRequest) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const { deckId, front, back } = await req.json();
  if (!deckId || !front || !back) {
    return NextResponse.json(
      { error: "deckId, front, and back are required" },
      { status: 400 }
    );
  }

  const deck = decks.find((d) => d.id === deckId && d.userId === userId);
  if (!deck)
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });

  const newCard = { id: String(cards.length + 1), deckId, front, back, userId };
  cards.push(newCard);
  deck.cardCount += 1;
  return NextResponse.json(newCard, { status: 201 });
}
