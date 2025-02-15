import { NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/auth/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Registration failed" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
