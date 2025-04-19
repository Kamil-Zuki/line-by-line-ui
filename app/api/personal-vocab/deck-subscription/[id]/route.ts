import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck-subscription";

export async function POST(req: NextRequest, {props}: {props: {id: string}}) {
  //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     //#endregion

  try {

    const body = await req.json();

    const response = await fetch(`${API_URL}/${props.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok)
      throw NextResponse.json(
        { error: "Failed to create deck subscriptions" },
        { status: response.status }
      );

    const result = await response.json();

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, {props}: {props: {id: string}}) {
    //#region Access token
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       //#endregion
  
    try {
      const response = await fetch(`${API_URL}/${props.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok)
        throw NextResponse.json(
          { error: "Failed to delete deck subscriptions" },
          { status: response.status }
        );
  
      const result = await response.json();
  
      return NextResponse.json(result, {status: 200});
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }