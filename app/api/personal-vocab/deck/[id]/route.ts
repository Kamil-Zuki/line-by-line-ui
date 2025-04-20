import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Mark as dynamic

const API_URL = 'http://85.175.218.17/api/v1/deck'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   //#endregion

  try {

    const {id} = await params;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result, {status: 200});
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
    //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 //#endregion

  try {
    const body = await req.json();
    const response = await fetch(`http://85.175.218.17/api/v1/deck/${params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update deck" },
        { status: response.status }
      );
    }
    const result = await response.json();
    return NextResponse.json(result, {status: 200});
  } catch (error) {
    console.error("Error:", error);
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
    const response = await fetch(`http://85.175.218.17/api/v1/deck/${params.id}`, {
    method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok)
      return NextResponse.json(
        { error: "Failed to delete deck" },
        { status: response.status }
      );

    const result = await response.json();

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
