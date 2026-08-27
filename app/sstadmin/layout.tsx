import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";
import { getPreferredBackend, readBundle } from "@/lib/cms/store";
import { isEphemeralHost } from "@/lib/runtime";

export const metadata = {
  title: "Admin | Smart Squad Travels",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "";
  if (pathname === "/sstadmin/login") {
    return <main id="main-content">{children}</main>;
  }

  const { backend } = await readBundle();
  const preferred = getPreferredBackend();
  const label =
    preferred === "supabase"
      ? "Supabase"
      : backend === "filesystem"
        ? "Local files"
        : "Website defaults";

  const storageWarning =
    isEphemeralHost() && preferred !== "supabase"
      ? "Enquiries, photo uploads, and content edits will not persist on Vercel until you add Supabase keys and run supabase/production.sql."
      : undefined;

  return (
    <AdminShell backendLabel={label} storageWarning={storageWarning}>
      {children}
    </AdminShell>
  );
}
