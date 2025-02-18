import { NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/auth/register";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the error message if available, otherwise default to 'Registration failed'
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    // Assuming registration is successful, you might want to send a success message or the user's info
    return NextResponse.json(
      { message: "Registration successful", user: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
