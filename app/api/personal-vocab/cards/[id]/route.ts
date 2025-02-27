import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/term";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "GET",
      headers: {
        accept: "text/plain",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Card not found");
    }

    const card = await response.json();
    return NextResponse.json(card);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "PUT",
      headers: {
        accept: "text/plain",
        Authorization: token,
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to update card");
    }

    const card = await response.json();
    return NextResponse.json(card);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/${params.id}`, {
      method: "DELETE",
      headers: {
        accept: "text/plain",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete card");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
