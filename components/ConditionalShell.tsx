"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/custom/shared/footer";
import WhatsAppFab from "@/components/custom/shared/whatsapp-fab";

const HIDDEN_ROUTES = ["/login", "/admin"];

export default function ConditionalShell() {
  const pathname = usePathname();
  const hide = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));
  if (hide) return null;
  return (
    <>
      <Footer />
      {/* <WhatsAppFab /> */}
    </>
  );
}
