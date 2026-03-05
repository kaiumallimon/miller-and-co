import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  _honeypot?: string; // must be empty — filled only by bots
}

// ─── In-memory rate limiter ────────────────────────────────────────────────────
// Limits each IP to MAX_REQUESTS per WINDOW_MS
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;

const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  entry.count += 1;
  return false;
}

// ─── Origin / Referer guard ────────────────────────────────────────────────────
function isAllowedOrigin(req: NextRequest): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";

  // Allow localhost in development
  if (process.env.NODE_ENV === "development") {
    return (
      origin.startsWith("http://localhost") ||
      referer.startsWith("http://localhost")
    );
  }

  return origin === siteUrl || referer.startsWith(siteUrl);
}

// ─── Input sanitisation ────────────────────────────────────────────────────────
function sanitise(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 2000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Nodemailer transporter ────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Content-type guard
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 415 });
  }

  // 2. Origin / Referer guard
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // 3. Rate limiting (by forwarded IP or socket IP)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  // 4. Parse body
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, subject, message, _honeypot } = body;

  // 5. Honeypot check — bots fill hidden fields, humans don't
  if (_honeypot && _honeypot.length > 0) {
    // Silently succeed to fool bots
    return NextResponse.json({ success: true });
  }

  // 6. Required field validation
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  // 7. Sanitise inputs
  const safeName = sanitise(name);
  const safeEmail = sanitise(email);
  const safePhone = phone ? sanitise(phone) : "Not provided";
  const safeSubject = sanitise(subject);
  const safeMessage = sanitise(message);

  // 8. Build and send email
  const transporter = createTransporter();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#1a1a1a;padding:32px 40px;">
        <h1 style="color:#c8a96e;margin:0;font-size:22px;font-weight:600;">
          New Contact Form Submission
        </h1>
        <p style="color:#ffffff80;margin:6px 0 0;font-size:13px;">Miller &amp; Co. Website</p>
      </div>
      <div style="padding:32px 40px;border:1px solid #e5e5e5;border-top:none;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;width:120px;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
              <a href="mailto:${safeEmail}" style="color:#c8a96e;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;">Phone</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${safePhone}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;">Subject</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:600;">${safeSubject}</td>
          </tr>
        </table>
        <div style="margin-top:24px;">
          <p style="color:#666;font-size:13px;margin:0 0 8px;">Message</p>
          <div style="background:#faf8f5;padding:20px;border-left:3px solid #c8a96e;font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</div>
        </div>
      </div>
      <div style="padding:20px 40px;background:#faf8f5;border:1px solid #e5e5e5;border-top:none;font-size:11px;color:#999;text-align:center;">
        This email was sent from the contact form on visa-australia.legal
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.CONTACT_FROM_NAME}" <${process.env.CONTACT_FROM_ADDRESS}>`,
      to: process.env.CONTACT_RECIPIENT,
      replyTo: safeEmail,
      subject: `[Miller & Co] ${safeSubject}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] SMTP error:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 500 }
    );
  }
}

// Block all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
