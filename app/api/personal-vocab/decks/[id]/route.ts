import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_URL}/${params.id}`, { method: "GET" });

    if (!response.ok) throw new Error("Deck not found");

    const deck = await response.json();
    return NextResponse.json(deck);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, groupId, token } = await req.json();
    if (!name || !groupId || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json-patch+json",
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, groupId }),
    });

    if (!response.ok) throw new Error("Failed to update deck");

    const updatedDeck = await response.json();
    return NextResponse.json(updatedDeck);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { token } = await req.json();
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "DELETE",
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete deck");

    return NextResponse.json({ message: "Deck deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
