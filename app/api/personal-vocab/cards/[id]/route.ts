import { NextRequest, NextResponse } from "next/server";
import { cards, decks } from "@/app/lib/mockData";
import { authMiddleware } from "@/app/lib/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const card = cards.find((c) => c.id === params.id && c.userId === userId);
  if (!card)
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  return NextResponse.json(card);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const cardIndex = cards.findIndex(
    (c) => c.id === params.id && c.userId === userId
  );
  if (cardIndex === -1)
    return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const { front, back } = await req.json();
  if (!front || !back)
    return NextResponse.json(
      { error: "front and back are required" },
      { status: 400 }
    );

  cards[cardIndex] = { ...cards[cardIndex], front, back };
  return NextResponse.json(cards[cardIndex]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const cardIndex = cards.findIndex(
    (c) => c.id === params.id && c.userId === userId
  );
  if (cardIndex === -1)
    return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const deck = decks.find((d) => d.id === cards[cardIndex].deckId);
  if (deck) deck.cardCount -= 1;
  cards.splice(cardIndex, 1);
  return NextResponse.json({ message: "Card deleted" });
}
