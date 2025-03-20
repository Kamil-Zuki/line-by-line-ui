import { NextRequest, NextResponse } from "next/server";
import { decks } from "@/app/lib/mockData";
import { authMiddleware } from "@/app/lib/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const deck = decks.find((d) => d.id === params.id && d.userId === userId);
  if (!deck)
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  return NextResponse.json(deck);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const deckIndex = decks.findIndex(
    (d) => d.id === params.id && d.userId === userId
  );
  if (deckIndex === -1)
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });

  const { title } = await req.json();
  if (!title)
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  decks[deckIndex].title = title;
  return NextResponse.json(decks[deckIndex]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const deckIndex = decks.findIndex(
    (d) => d.id === params.id && d.userId === userId
  );
  if (deckIndex === -1)
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });

  decks.splice(deckIndex, 1);
  return NextResponse.json({ message: "Deck deleted" });
}
