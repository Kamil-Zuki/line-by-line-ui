import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/term";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        accept: "text/plain",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }

    const cards = await response.json();
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        accept: "text/plain",
        Authorization: token,
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create card");
    }

    const card = await response.json();
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
