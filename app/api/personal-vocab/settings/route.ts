import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/settings`;

export async function PUT(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  const body = await req.json();

  console.log("API_URL", API_URL);
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}

export async function GET(req: NextRequest) {
  console.log("API_URL", API_URL);
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion
  console.log("Settings get method method");
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to get settings" },
      { status: 500 }
    );

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
