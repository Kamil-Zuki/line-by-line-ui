import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card";

export async function GET(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const response = await fetch(`${API_URL}/${params.deckId}/cards`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to create a card" },
      { status: 500 }
    );

  const card = await response.json();

  return NextResponse.json(card, { status: 200 });
}
