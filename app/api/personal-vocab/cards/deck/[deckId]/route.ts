import { NextRequest, NextResponse } from "next/server";
import { cards } from "@/app/lib/mockData";
import { authMiddleware } from "@/app/lib/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { userId } = auth;
  const deckCards = cards.filter(
    (c) => c.deckId === params.deckId && c.userId === userId
  );
  return NextResponse.json(deckCards);
}
