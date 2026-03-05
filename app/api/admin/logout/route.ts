import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      // Revoke all refresh tokens for the user so the session can't be reused
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    }
  } catch {
    // Ignore verification errors — still clear the cookie
  }

  const response = NextResponse.json({ success: true });
  // Expire the cookie immediately
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}
