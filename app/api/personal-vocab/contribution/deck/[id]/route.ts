import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/contribution";

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

  const response = await fetch(`${API_URL}/deck/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
