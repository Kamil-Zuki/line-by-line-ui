import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Ensure the token is in "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader
      : `Bearer ${authHeader}`;

     const paramsData = await params;
    const { id } = paramsData; 
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 401) {
      return NextResponse.json(
        { error: "Unauthorized - invalid or expired token" },
        { status: 401 }
      );
    }

    if (!response.ok) {
      throw new Error(`Deck not found or server error: ${response.status}`);
    }

    const deck = await response.json();
    return NextResponse.json(deck);
  } catch (error: any) {
    const status = error.message.includes("Deck not found") ? 404 : 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    const paramsData = await params;
    const { name, groupId, token } = await req.json();
    if (!name || !groupId || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/${paramsData.id}`, {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsData = await params;
    const { token } = await req.json();
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch(`${API_URL}/${paramsData.id}`, {
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
