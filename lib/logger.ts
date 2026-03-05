import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export type LogCategory = "auth" | "admin" | "contact";

export interface WriteLogOptions {
  action: string;
  category: LogCategory;
  actor: string;         // admin email or "system"
  target?: string;       // affected email / document ID
  details?: string;      // human-readable description
  ip?: string;           // x-forwarded-for header value
}

/**
 * Writes a non-fatal activity log to the Firestore `logs` collection.
 * Errors are silently swallowed so a log failure never breaks the caller.
 */
export async function writeLog(opts: WriteLogOptions): Promise<void> {
  try {
    await adminDb.collection("logs").add({
      ...opts,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("[logger] Failed to write log:", err);
  }
}
