import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

/**
 * Reads and verifies the session cookie from the incoming request.
 * Returns the decoded token (with uid, email, etc.) or null if invalid.
 *
 * Safe to call from Server Components, API Routes, and Server Actions.
 */
export async function getSessionUser(): Promise<DecodedIdToken | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
