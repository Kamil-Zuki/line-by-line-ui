import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card/all";

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  // Get deckId from query parameters
  const deckId = req.nextUrl.searchParams.get("deckId");
  if (!deckId)
    return NextResponse.json({ error: "deckId is required" }, { status: 400 });

  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to get cards" },
      { status: 500 }
    );

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
