import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const awaitedParams = await params;
  const id = awaitedParams.id;

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to get a card" },
      { status: 500 }
    );

  const card = await response.json();

  return NextResponse.json(card, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) 
{
   try { 

  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const awaitedParams = await params
  const id = awaitedParams.id; 
   
  const body = await req.json();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(body),
  });

const result = await response.json();

if (!response.ok) {
  return NextResponse.json(result, { status: response.status });
}


return NextResponse.json(result);
} catch (error) { 
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }); } 
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const response = await fetch(`${API_URL}/${params.id}`, {
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
