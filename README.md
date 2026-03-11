# Miller & Co. — Migration Law Firm Website

> Official website for **Miller & Co.**, a Sydney-based migration law firm specialising in employer-sponsored visas, skilled visas, partner visas, investment visas, global talent visas, AAT appeals, and Australian citizenship.

**Live URL:** [https://www.visa-australia.legal](https://www.visa-australia.legal)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Authentication & Security](#authentication--security)
- [Admin Panel](#admin-panel)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

Miller & Co. is a full-stack Next.js web application serving as the public-facing website and internal content management system for the law firm. It includes a fully animated public site (Home, About, Services, Blog, Contact, etc.) alongside a protected admin dashboard for managing blog posts, FAQs, contact submissions, media assets, admin accounts, and system logs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4, clsx, tailwind-merge, CVA |
| Animations | [GSAP](https://gsap.com/), [Motion (Framer Motion)](https://motion.dev/) |
| Rich Text Editor | [Tiptap v3](https://tiptap.dev/) |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| Authentication | Firebase Auth + Firebase Admin SDK (session cookies) |
| Media CDN | [Cloudinary](https://cloudinary.com/) |
| Email | [Nodemailer](https://nodemailer.com/) |
| Charts | [Recharts](https://recharts.org/) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/), [Vaul](https://vaul.emilkowal.ski/) |
| Hosting | [Vercel](https://vercel.com/) |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                       Vercel (CDN / Edge)                    │
│                                                              │
│  ┌──────────────────────┐    ┌───────────────────────────┐  │
│  │   Public Routes       │    │   Admin Routes            │  │
│  │  / /about /blog ...   │    │  /admin/*                 │  │
│  │  (Server Components)  │    │  (Protected via           │  │
│  │                       │    │   Middleware + Layout)    │  │
│  └───────────┬───────────┘    └─────────────┬─────────────┘  │
│              │                              │                 │
│  ┌───────────▼──────────────────────────────▼────────────┐   │
│  │               Next.js App Router                       │   │
│  │  Server Components │ Client Components │ API Routes   │   │
│  └───────────┬─────────────────────────────┬─────────────┘   │
│              │                             │                  │
│  ┌───────────▼──────────┐    ┌─────────────▼──────────────┐  │
│  │  Firebase Firestore   │    │      Cloudinary CDN         │  │
│  │  (posts, faqs, logs,  │    │  (blog cover images,        │  │
│  │   admins, submissions │    │   media assets)             │  │
│  │   contacts)           │    └────────────────────────────┘  │
│  └──────────────────────┘                                    │
│  ┌──────────────────────┐    ┌────────────────────────────┐  │
│  │   Firebase Auth       │    │    Nodemailer (SMTP)        │  │
│  │  (admin sign-in,      │    │  (contact form emails)      │  │
│  │   session cookies)    │    └────────────────────────────┘  │
│  └──────────────────────┘                                    │
└──────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Public users** hit public routes — server-rendered Next.js pages that fetch data directly from Firestore via the Firebase Admin SDK.
2. **Admin users** attempt to access `/admin/*` — the Next.js **middleware** (`middleware.ts`) checks for a `session` cookie and redirects unauthenticated users to `/login`.
3. The **admin layout** (`app/admin/layout.tsx`) performs a server-side session verification via `getSessionUser()`, which calls `adminAuth.verifySessionCookie()`. Stale sessions trigger a redirect to the logout endpoint so the cookie is cleared before landing on `/login`.
4. **API routes** under `app/api/admin/*` are individually guarded by calling `getSessionUser()` and returning `401` for unauthorised requests.
5. Every authenticated admin action writes a structured **audit log** entry to Firestore via the shared `writeLog()` utility.

---

## Project Structure

```
miller-and-co/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (metadata, fonts, preloader)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global Tailwind styles
│   ├── not-found.tsx             # 404 page
│   │
│   ├── about/                    # About page
│   ├── blog/                     # Blog listing + individual post [slug]
│   ├── contact/                  # Contact page
│   ├── services/                 # Services page
│   ├── login/                    # Admin login page
│   ├── disclaimer/               # Disclaimer page
│   ├── privacy-policy/           # Privacy policy page
│   ├── terms/                    # Terms of service page
│   │
│   ├── admin/                    # Protected admin dashboard
│   │   ├── layout.tsx            # Admin layout (auth guard + AdminShell)
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── accounts/             # Admin account management
│   │   ├── blogs/                # Blog CRUD (list, new, [id]/edit)
│   │   ├── cdn/                  # Cloudinary media manager
│   │   ├── faqs/                 # FAQ management
│   │   ├── logs/                 # System activity logs
│   │   └── submissions/          # Contact form submissions
│   │
│   └── api/                      # Next.js API routes
│       ├── admin/
│       │   ├── login/            # POST — exchange Firebase ID token for session cookie
│       │   ├── logout/           # POST — clear session cookie
│       │   ├── accounts/         # GET/POST/DELETE admin accounts
│       │   ├── blogs/            # GET/POST/PATCH/DELETE blog posts
│       │   │   └── [id]/         # Single post operations
│       │   ├── cdn/
│       │   │   ├── upload/       # POST — upload image to Cloudinary
│       │   │   └── stats/        # GET — Cloudinary usage stats
│       │   ├── faqs/             # GET/POST/PATCH/DELETE FAQs
│       │   │   └── [id]/
│       │   ├── logs/             # GET activity logs
│       │   └── submissions/      # GET/PATCH contact submissions
│       │       └── [id]/
│       ├── blogs/                # Public blog API
│       │   ├── route.ts          # GET — list published posts
│       │   └── [slug]/route.ts   # GET — single post by slug
│       ├── contact/route.ts      # POST — contact form (rate-limited, anti-spam)
│       └── faqs/home/route.ts    # GET — public FAQs
│
├── components/
│   ├── AnimateIn.tsx             # Viewport entrance animation wrapper (Motion)
│   ├── ConditionalShell.tsx      # Hides header/footer on admin & login routes
│   ├── CountUp.tsx               # Animated number counter (scroll-triggered)
│   ├── GradientText.tsx          # CSS gradient text component
│   ├── Preloader.tsx             # Full-screen intro animation (GSAP)
│   ├── PreloaderClient.tsx       # Client wrapper for the preloader
│   ├── PreloaderContext.tsx      # React context for preloader visibility state
│   ├── ScrollReveal.tsx          # Scroll-triggered reveal animation
│   ├── ShinyText.tsx             # Animated shiny-text effect
│   │
│   ├── admin/
│   │   ├── AdminShell.tsx        # Admin sidebar layout with grouped navigation
│   │   ├── PostEditor.tsx        # Full blog post editor UI (metadata, SEO, cover image)
│   │   └── TiptapEditor.tsx      # Rich text editor (Tiptap, dynamically imported)
│   │
│   ├── custom/
│   │   ├── about/                # About page sections (hero, firm story, principal, why-choose-us)
│   │   ├── blog/                 # Blog list & post client components, share bar
│   │   ├── contact/              # Contact form + page sections
│   │   ├── home/                 # All home page sections (hero, help, expertise, stats, etc.)
│   │   ├── services/             # Services page client component
│   │   └── shared/               # Header, Footer, WhatsApp FAB
│   │
│   └── ui/                       # shadcn/ui primitives (badge, button, card, drawer, input, label)
│
├── hooks/
│   ├── useParallax.ts            # Parallax scroll effect via GSAP
│   └── useScroll.ts              # Scroll position tracking hook
│
├── lib/
│   ├── logger.ts                 # Firestore activity logger (writeLog)
│   ├── typographies.tsx          # Next.js font definitions (headline + body fonts)
│   ├── utils.ts                  # cn() utility — clsx + tailwind-merge
│   ├── auth/
│   │   └── session.ts            # getSessionUser() — server-side session cookie verification
│   └── firebase/
│       ├── admin.ts              # Firebase Admin SDK singleton (adminAuth, adminDb)
│       └── client.ts             # Firebase Client SDK singleton (auth)
│
├── middleware.ts                  # Edge route protection for /admin/* and /login
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS / Tailwind config
├── eslint.config.mjs             # ESLint configuration
└── components.json               # shadcn/ui configuration
```

---

## Key Features

### Public Website

- **Home** — Hero, help overview, expertise cards, animated statistics, principal bio, testimonials, partners, FAQ accordion, and CTA section.
- **About** — Firm story, meet-the-principal section, and why-choose-us breakdown.
- **Services** — Overview of all visa categories handled by the firm.
- **Blog** — Paginated post listing with individual post pages; social share bar on each post.
- **Contact** — Enquiry form with server-side rate limiting, honeypot anti-spam, origin header validation, and email delivery via Nodemailer.
- **Legal pages** — Privacy Policy, Terms of Service, Disclaimer.

### Animations & UX

- GSAP-powered full-screen **preloader** shown once per browser session (controlled via `sessionStorage`).
- `ScrollReveal` and `AnimateIn` wrappers using Framer Motion for staggered viewport entrance transitions.
- Parallax scroll effects via the custom `useParallax` GSAP hook.
- `CountUp` component that animates statistics when they scroll into the viewport.
- Sticky header and WhatsApp floating action button.
- `ConditionalShell` automatically hides the public header/footer on `/admin/*` and `/login` routes without requiring per-page logic.

---

## Authentication & Security

Authentication is built on **Firebase Auth** on the client combined with **Firebase Admin SDK session cookies** on the server — no third-party auth middleware required.

### Login Flow

1. Admin enters credentials on `/login`; the client calls `signInWithEmailAndPassword` via the Firebase Client SDK.
2. On success, the client obtains a short-lived Firebase **ID token** and `POST`s it to `/api/admin/login`.
3. The server verifies the ID token with `adminAuth.verifyIdToken()`, then creates a server-managed session cookie via `adminAuth.createSessionCookie()` (max validity: 5 days).
4. The cookie is set as `HttpOnly`, `Secure` (in production), `SameSite=Lax` — no `Max-Age`, so it is cleared when the browser session ends.

### Route Protection (Three Layers)

| Layer | Mechanism |
|---|---|
| **Edge middleware** | `middleware.ts` inspects the `session` cookie on every `/admin/*` request before the page renders |
| **Admin layout** | `app/admin/layout.tsx` calls `getSessionUser()` server-side for cryptographic re-verification |
| **API routes** | Each admin API handler independently calls `getSessionUser()` and returns `401 Unauthorized` if absent or invalid |

### Contact Form Security

| Measure | Detail |
|---|---|
| Rate limiting | 3 requests per IP per minute (in-memory map, resets on timeout) |
| Origin/Referer guard | Requests not originating from the production domain are rejected in production |
| Honeypot field | A hidden field silently rejects bot submissions |
| Input sanitisation | HTML angle brackets stripped; fields capped at 2 000 characters |

---

## Admin Panel

Accessible at `/admin` after authentication. Navigation is grouped into sections within `AdminShell`:

| Section | Page | Purpose |
|---|---|---|
| Overview | Dashboard | Site statistics at a glance (Recharts) |
| Enquiries | Contact Submissions | View and triage contact form enquiries |
| Blogs | All Posts | Filter, search, and manage blog posts |
| Blogs | New Post | Create a post with rich text, SEO, and cover image |
| Blogs | Edit Post | Edit an existing post (pre-populated editor) |
| Content | FAQs | Create, edit, reorder, and delete public FAQs |
| Media | CDN Management | Browse, upload, and delete Cloudinary assets |
| System | Activity Logs | Server-side audit trail of all admin actions |
| System | Accounts | Manage which Firebase users have admin access |

### Blog Post Editor (`PostEditor` + `TiptapEditor`)

- **Rich text** via Tiptap with extensions: headings, lists, blockquote, code, links, images, tables, text colour, highlight, underline, sub/superscript, text alignment, and character count.
- **Cover image** — uploaded directly to Cloudinary; the returned public ID is stored alongside the URL to enable clean deletion on overwrite.
- **SEO panel** — custom meta title, meta description, and Open Graph image URL per post.
- **Metadata** — tags (comma-separated), category, featured flag, comments toggle.
- **Status** — Draft / Published toggle; drafts are excluded from all public-facing API responses.
- **Auto-computed** — URL slug (slugified from title), estimated reading time (200 wpm), word count, and a plain-text excerpt (first 500 chars).

### Activity Logging

Every significant admin action writes a document to the Firestore `logs` collection:

```ts
{
  action:   "admin_login" | "post_created" | "post_updated" | "faq_deleted" | ...,
  category: "auth" | "admin" | "contact",
  actor:    "admin@example.com",   // or "system"
  target?:  "post-id or user email",
  details?: "Human-readable description",
  ip?:      "1.2.3.4",            // x-forwarded-for
  createdAt: Timestamp             // Firestore server timestamp
}
```

Logging is fire-and-forget — errors are silently swallowed so a log failure never breaks the caller.

---

## API Routes

### Public Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/blogs` | List all published blog posts (newest first) |
| `GET` | `/api/blogs/[slug]` | Fetch a single published post by URL slug |
| `GET` | `/api/faqs/home` | Fetch all published FAQs |
| `POST` | `/api/contact` | Submit a contact enquiry (rate-limited, anti-spam) |

### Admin Endpoints (session cookie required)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Exchange a Firebase ID token for a session cookie |
| `POST` | `/api/admin/logout` | Clear the session cookie |
| `GET` | `/api/admin/blogs` | List all posts (supports `?status=` and `?category=` filters) |
| `POST` | `/api/admin/blogs` | Create a new blog post |
| `PATCH` | `/api/admin/blogs/[id]` | Update a blog post |
| `DELETE` | `/api/admin/blogs/[id]` | Delete a blog post (and its Cloudinary cover image) |
| `GET/POST` | `/api/admin/faqs` | List / create FAQs |
| `PATCH/DELETE` | `/api/admin/faqs/[id]` | Update / delete a FAQ |
| `GET` | `/api/admin/submissions` | List contact form submissions |
| `PATCH` | `/api/admin/submissions/[id]` | Update submission status (e.g. mark as read) |
| `POST` | `/api/admin/cdn/upload` | Upload an image to Cloudinary |
| `GET` | `/api/admin/cdn/stats` | Retrieve Cloudinary account usage statistics |
| `GET` | `/api/admin/logs` | Fetch paginated activity logs |
| `GET/POST/DELETE` | `/api/admin/accounts` | List / create / remove admin accounts |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# ── Firebase Client SDK (exposed to browser) ──────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ── Firebase Admin SDK (server-only, never exposed) ───────────
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=        # Paste the full key; use \\n for literal newlines

# ── Cloudinary ─────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ── Nodemailer (SMTP) ──────────────────────────────────────────
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_TO=                           # Destination address for contact form emails

# ── Site ───────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://www.visa-australia.legal
```

> **Important:** Never commit `.env.local` to version control. For Vercel deployments, add these variables in the project's **Environment Variables** settings panel.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with **Firestore** and **Authentication** (Email/Password provider) enabled
- A Cloudinary account
- An SMTP account (e.g. Gmail App Password, SendGrid, Mailgun)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd miller-and-co

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in all required values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin) — you must first create an admin user account in your Firebase project console, then log in via [http://localhost:3000/login](http://localhost:3000/login).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check and produce an optimised production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

### Deployment

The project is configured for zero-config deployment on **Vercel**.

1. Push the repository to GitHub / GitLab / Bitbucket.
2. Import the project in the Vercel dashboard.
3. Add all environment variables from the table above in **Project → Settings → Environment Variables**.
4. Deploy — Vercel automatically builds and deploys on every push to `main`.
