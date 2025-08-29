import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/deck`;

export async function POST(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
