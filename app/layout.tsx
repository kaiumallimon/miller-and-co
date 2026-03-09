import type { Metadata } from "next";
import "./globals.css";
import { bodyFont, headlineFont } from "@/lib/typographies";
import PreloaderClient from "@/components/PreloaderClient";
import { PreloaderProvider } from "@/components/PreloaderContext";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.visa-australia.legal"),
  title: {
    default: "Miller & Co. | Sydney Migration Law Firm",
    template: "%s | Miller & Co.",
  },
  description:
    "Miller & Co. is a trusted Sydney-based migration law firm specialising in employer-sponsored visas, skilled visas, partner visas, investment visas, global talent visas, AAT appeals, and Australian citizenship. With over 10,000 successful cases, our experienced team delivers expert immigration solutions.",
  keywords: [
    "migration law firm Sydney",
    "Australian visa lawyer",
    "employer sponsored visa",
    "subclass 482 visa",
    "subclass 186 visa",
    "skilled visa Australia",
    "partner visa Australia",
    "national innovation visa",
    "investment visa Australia",
    "AAT appeal migration",
    "Australian citizenship",
    "Bondi Junction immigration lawyer",
    "Miller and Co migration",
    "visa-australia.legal",
  ],
  authors: [{ name: "Miller & Co.", url: "https://www.visa-australia.legal" }],
  creator: "Miller & Co.",
  publisher: "Miller & Co.",
  applicationName: "Miller & Co. Migration Law",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://www.visa-australia.legal",
    siteName: "Miller & Co.",
    title: "Miller & Co. | Sydney Migration Law Firm",
    description:
      "Sydney's trusted migration law firm with over 10,000 successful cases. Expert guidance on employer-sponsored visas, skilled visas, partner visas, investment visas, global talent visas, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miller & Co. | Sydney Migration Law Firm",
    description:
      "Sydney's trusted migration law firm with over 10,000 successful cases. Expert guidance on all Australian visa categories.",
  },
  alternates: {
    canonical: "https://www.visa-australia.legal",
  },
  category: "Legal Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Prevent flash of content before preloader mounts on first visit */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          if (sessionStorage.getItem('preloader_seen') !== '1') {
            document.documentElement.style.visibility = 'hidden';
          }
        ` }} />
      </head>
      <body
        className={`${bodyFont.className} ${headlineFont.variable} antialiased`}
      >
        <PreloaderProvider>
          <PreloaderClient />
          {children}
          <ConditionalShell />
        </PreloaderProvider>
      </body>
    </html>
  );
}
