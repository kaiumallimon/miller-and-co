import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

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
  // Redirect through the logout endpoint so the stale session cookie is
  // cleared before the browser lands on /login — prevents redirect loops.
  if (!user) redirect("/api/admin/logout");

  return (
    <AdminShell email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
