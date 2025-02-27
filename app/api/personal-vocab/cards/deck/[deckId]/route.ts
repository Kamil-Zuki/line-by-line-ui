import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/term/deck";

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ deckId: string }> } // params is a Promise
) {
  const params = await paramsPromise; // Unwrap the Promise
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/${params.deckId}`, {
      method: "GET",
      headers: {
        accept: "text/plain",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cards for deck");
    }

    const cards = await response.json();
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
