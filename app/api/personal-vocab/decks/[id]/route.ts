import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Mark as dynamic

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`http://85.175.218.17/api/v1/deck/${params.id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to fetch deck" },
        { status: res.status }
      );
    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    console.log("PUT request body for deckId:", params.id, body);
    const res = await fetch(`http://85.175.218.17/api/v1/deck/${params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with ${res.status}: ${errorText}`);
      return NextResponse.json(
        { error: "Failed to update deck" },
        { status: res.status }
      );
    }
    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Error updating deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`http://85.175.218.17/api/v1/deck/${params.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to delete deck" },
        { status: res.status }
      );
    return NextResponse.json({ message: "Deck deleted" });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
