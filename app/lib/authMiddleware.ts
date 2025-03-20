import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { userId };
}
