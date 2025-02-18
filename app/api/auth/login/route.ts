import { NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/auth/login";

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
    // console.log(data);

    if (!response.ok) {
      // Return the error message if available, otherwise default to 'Login failed'
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: response.status }
      );
    }

    // Store JWT token in localStorage or cookies (for example in localStorage)
    const token = data.data; // Assuming the token is inside `data.data`
    if (token) {
      // Store token in localStorage (or cookies if you prefer)
      localStorage.setItem("token", token);
    }

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
