import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck-subscription";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // Correct way to access dynamic segments
) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //#endregion

  try {
    const awatedParams =  await params; 
    const id = awatedParams.id;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create deck subscriptions" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
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
  //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //#endregion
  console.log("Delete method")
  try {
    const awatedParams =  await params; 
    const id = awatedParams.id;
    console.log(id)
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete deck subscriptions" },
        { status: response.status }
      );
    }

    // const result = await response.json();

    return NextResponse.json( {status: 200} );
  } catch (error) {
     console.error("Error in DELETE handler:", error); 
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}