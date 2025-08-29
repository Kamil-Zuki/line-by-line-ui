import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/card`;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion
  const body = await req.json();

  const awaitedParams = await params;
  const id = awaitedParams.id;
  console.log(id);
  const response = await fetch(`${API_URL}/review/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok){  
    console.log(response)
    return NextResponse.json({ error: response.statusText }, { status: response.status });
}

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
