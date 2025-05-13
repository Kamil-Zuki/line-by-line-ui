import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/card`;

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken)
    return NextResponse.json({ error: "Falled to authorize" }, { status: 401 });

  const body = await req.json();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to create a card" },
      { status: 500 }
    );

  const newCard = await response.json();

  return NextResponse.json(newCard, { status: 201 });
}
