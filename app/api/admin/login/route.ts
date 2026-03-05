import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body as { idToken?: string };

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    // Verify the ID token from the client
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Create a Firebase session cookie (token valid for 5 days server-side,
    // but the HTTP cookie has NO Max-Age/Expires → cleared when browser closes)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Upsert the admin record in Firestore.
    // Only set createdAt on first write — never overwrite it on subsequent logins.
    const adminRef = adminDb.collection("admins").doc(decoded.uid);
    const existing = await adminRef.get();
    const now = new Date().toISOString();
    if (!existing.exists) {
      await adminRef.set({
        uid: decoded.uid,
        email: decoded.email ?? null,
        createdAt: now,
        lastLogin: now,
        active: true,
      });
    } else {
      await adminRef.update({ lastLogin: now });
    }

    // Set the cookie — deliberately no maxAge/expires so it's a session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[Admin Login]", err);
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
}
