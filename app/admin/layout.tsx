import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { bodyFont, headlineFont } from "@/lib/typographies";

export const metadata = {
  title: "Admin Dashboard — Miller & Co.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div
      className={`${bodyFont.className} min-h-screen bg-[#0f0f0f] text-white flex flex-col`}
    >
      {/* Top bar */}
      <header className="border-b border-white/6 bg-[#141414] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span
            className={`${headlineFont.className} text-[#c8a96e] text-xl font-semibold tracking-wide`}
          >
            Miller &amp; Co.
          </span>
          <span className="text-white/15 text-xs tracking-widest uppercase">
            Admin
          </span>
        </div>
        <p className="text-white/30 text-xs truncate max-w-xs">{user.email}</p>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
