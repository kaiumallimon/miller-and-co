import type { Metadata } from "next";
import "./globals.css";
import { bodyFont } from "@/lib/typographies";
import Footer from "@/components/custom/shared/footer";
import WhatsAppFab from "@/components/custom/shared/whatsapp-fab";
import Preloader from "@/components/Preloader";

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
    <html lang="en">
      <body
        className={`${bodyFont.className} antialiased`}
      >
        <Preloader />
        {children}
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
