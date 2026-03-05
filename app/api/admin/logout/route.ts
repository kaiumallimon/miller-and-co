import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

// GET — used by server-side redirects (e.g. expired/disabled session)
// Clears the session cookie then sends the browser to /login
export async function GET(request: Request) {
  // Derive base URL from the actual incoming request so it works on any
  // domain (localhost, Vercel preview, custom domain) without relying on env vars.
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/login`);
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}

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
