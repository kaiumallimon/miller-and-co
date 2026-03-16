import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { writeLog } from "@/lib/logger";
import { consumeRateLimit, getClientIp } from "@/lib/security/rate-limit";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  _honeypot?: string; // must be empty — filled only by bots
  formStartedAt?: number;
  recaptchaToken?: string;
}

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 3;
const MIN_HUMAN_FILL_MS = 2500;

function looksLikeLinkSpam(input: string): boolean {
  const lower = input.toLowerCase();
  const httpCount = (lower.match(/http:\/\//g) ?? []).length;
  const httpsCount = (lower.match(/https:\/\//g) ?? []).length;
  const wwwCount = (lower.match(/www\./g) ?? []).length;
  return httpCount + httpsCount + wwwCount >= 2;
}

// ─── Origin / Referer guard ────────────────────────────────────────────────────
function isAllowedOrigin(req: NextRequest): boolean {
  // Always allow in development
  if (process.env.NODE_ENV === "development") return true;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";

  return origin === siteUrl || referer.startsWith(siteUrl);
}

// ─── Input sanitisation ────────────────────────────────────────────────────────
function sanitise(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 2000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: ip,
    });

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!res.ok) return false;
    const data = (await res.json()) as RecaptchaVerifyResponse;

    return Boolean(data.success);
  } catch {
    return false;
  }
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
    console.warn("[contact] Rejected: invalid content-type:", contentType);
    return NextResponse.json({ error: "Invalid content type." }, { status: 415 });
  }

  // 2. Origin / Referer guard
  if (!isAllowedOrigin(req)) {
    console.warn("[contact] Rejected: origin:", req.headers.get("origin"), "referer:", req.headers.get("referer"));
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // 3. Rate limiting (by forwarded IP or socket IP)
  const ip = getClientIp(req.headers);
  const rate = consumeRateLimit(`contact:${ip}`, MAX_REQUESTS, WINDOW_MS);
  if (!rate.allowed) {
    console.warn("[contact] Rate limited IP:", ip);
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  // 4. Parse body
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, subject, message, _honeypot, formStartedAt, recaptchaToken } = body;

  // 5. Honeypot check — bots fill hidden fields, humans don't
  if (_honeypot && _honeypot.length > 0) {
    console.warn("[contact] Honeypot triggered — blocked bot submission");
    return NextResponse.json({ success: true });
  }

  if (process.env.RECAPTCHA_SECRET_KEY) {
    if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken, ip))) {
      console.warn("[contact] reCAPTCHA verification failed");
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 400 }
      );
    }
  }

  // 5b. Time-trap heuristic: block submissions that are unrealistically fast
  if (
    typeof formStartedAt === "number" &&
    Number.isFinite(formStartedAt) &&
    Date.now() - formStartedAt < MIN_HUMAN_FILL_MS
  ) {
    console.warn("[contact] Time-trap triggered — blocked fast submission");
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
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

  if (looksLikeLinkSpam(`${safeSubject} ${safeMessage}`)) {
    console.warn("[contact] Link-spam heuristic triggered");
    return NextResponse.json({ error: "Please remove promotional links and try again." }, { status: 400 });
  }

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
      <div style="padding:20px 40px;background:#faf8f5;border:1px solid #e5e5e5;border-top:none;">
        <p style="margin:0 0 6px;font-size:13px;color:#1a1a1a;">
          To reply to this enquiry, email <a href="mailto:${safeEmail}" style="color:#c8a96e;font-weight:600;">${safeEmail}</a> directly.
        </p>
        <p style="margin:0;font-size:11px;color:#aaa;">
          ⚠ Do not reply to this email — it was sent from an unmonitored address. This message was submitted via the contact form on visa-australia.legal.
        </p>
      </div>
    </div>
  `;

  try {
    // Verify SMTP connection before attempting send
    await transporter.verify();

    // Save to Firestore + send email in parallel
    await Promise.all([
      // Persist to Firestore so admin panel can view it
      adminDb.collection("contacts").add({
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        subject: safeSubject,
        message: safeMessage,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      }),
      // Send notification email
      transporter.sendMail({
        from: `"${process.env.CONTACT_FROM_NAME}" <${process.env.CONTACT_FROM_ADDRESS}>`,
        to: process.env.CONTACT_RECIPIENT,
        replyTo: safeEmail,
        subject: `[Miller & Co] ${safeSubject}`,
        html,
      }),
    ]);

    // Log the new contact submission
    await writeLog({
      action: "contact_submitted",
      category: "contact",
      actor: "system",
      target: safeEmail,
      details: `New enquiry from ${safeName} — "${safeSubject}".`,
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact] error:", message);
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
