import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card";

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const { cardId } = await req.json();

  const response = await fetch(`${API_URL}/${cardId}`, {
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

export async function DELETE(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const { cardId } = await req.json();

  const response = await fetch(`${API_URL}/${cardId}`, {
    method: "DELETE",
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

  return NextResponse.json({ message: "Success" }, { status: 201 });
}
