// app/api/personal-vocab/study/start/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/study/start`;

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("study/start: Access token:", accessToken);
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    console.log("study/start: Request body:", body);
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("study/start: Backend response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("study/start: Backend error:", errorData);
      return NextResponse.json(
        { error: "Failed to start session" },
        { status: response.status }
      );
    }
    const result = await response.json();
    console.log("study/start: Backend result:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("study/start: Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
