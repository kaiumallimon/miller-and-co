import type { Metadata } from "next";
import "./globals.css";
import { bodyFont } from "@/lib/typographies";
import Footer from "@/components/custom/shared/footer";
import WhatsAppFab from "@/components/custom/shared/whatsapp-fab";
import PreloaderClient from "@/components/PreloaderClient";
import { PreloaderProvider } from "@/components/PreloaderContext";

export const metadata: Metadata = {
  title: "Miller & Co. ",
  description: "Sydney based, top trusted Migration Law firm. We provide expert guidance and solutions for all your immigration needs. Trust our experienced team to navigate complex legal matters and ensure a smooth and successful migration process.",
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
        className={`${bodyFont.className} antialiased`}
      >
        <PreloaderProvider>
          <PreloaderClient />
          {children}
          <Footer />
          <WhatsAppFab />
        </PreloaderProvider>
      </body>
    </html>
  );
}
