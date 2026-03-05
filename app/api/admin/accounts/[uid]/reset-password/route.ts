import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import nodemailer from "nodemailer";

// ── POST — send password reset email ─────────────────────────────────────────
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const requester = await getSessionUser();
  if (!requester) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { uid } = await params;

  try {
    // Fetch the user's email from Firebase Auth
    const userRecord = await adminAuth.getUser(uid);
    const email = userRecord.email;
    if (!email) {
      return NextResponse.json({ error: "User has no email address." }, { status: 400 });
    }

    // Generate Firebase password reset link
    const resetLink = await adminAuth.generatePasswordResetLink(email);

    // Send via SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.CONTACT_FROM_NAME}" <${process.env.CONTACT_FROM_ADDRESS}>`,
      to: email,
      subject: "Miller & Co. — Password Reset",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
          <div style="background:#1a1a1a;padding:28px 32px;margin-bottom:24px">
            <p style="color:#c8a96e;font-size:18px;font-weight:600;margin:0">Miller &amp; Co.</p>
            <p style="color:#ffffff55;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:4px 0 0">Admin Panel</p>
          </div>
          <div style="padding:0 32px 32px">
            <h2 style="font-size:22px;margin:0 0 12px">Password Reset Request</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
              A password reset was requested for the admin account associated with
              <strong>${email}</strong>. Click the button below to reset your password.
            </p>
            <a href="${resetLink}" style="display:inline-block;background:#c8a96e;color:#0f0f0f;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:13px 28px">
              Reset Password
            </a>
            <p style="color:#aaa;font-size:11px;margin:24px 0 0;line-height:1.6">
              This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f5f5f5;padding:16px 32px;font-size:11px;color:#aaa">
            Sent by the Miller &amp; Co. admin panel &mdash; do not reply to this email.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Reset Password]", err);
    return NextResponse.json({ error: "Failed to send reset email." }, { status: 500 });
  }
}
