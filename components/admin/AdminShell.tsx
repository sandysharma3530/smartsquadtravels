"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/sstadmin", label: "Dashboard" },
  { href: "/sstadmin/enquiries", label: "Enquiries" },
  { href: "/sstadmin/site", label: "Business details" },
  { href: "/sstadmin/home", label: "Home page" },
  { href: "/sstadmin/destinations", label: "Destinations" },
  { href: "/sstadmin/fleet", label: "Fleet" },
  { href: "/sstadmin/services", label: "Services" },
  { href: "/sstadmin/faqs", label: "FAQs" },
  { href: "/sstadmin/reviews", label: "Reviews" },
  { href: "/sstadmin/blog", label: "Blog" },
  { href: "/sstadmin/gallery", label: "Gallery" },
  { href: "/sstadmin/pages", label: "About & legal" },
];

export function AdminShell({
  children,
  backendLabel,
  storageWarning,
}: {
  children: ReactNode;
  backendLabel: string;
  storageWarning?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/sstadmin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-navy text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-light">
            Admin
          </p>
          <p className="mt-1 text-lg font-bold">Smart Squad Travels</p>
          <p className="mt-2 text-xs text-white/60">Storage: {backendLabel}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/sstadmin"
                ? pathname === "/sstadmin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-1 block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-teal-light"
                    : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link href="/" className="mb-3 block text-sm text-white/70 hover:text-white">
            View website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <p className="font-bold text-navy">Admin</p>
          <button type="button" onClick={logout} className="text-sm font-semibold text-teal">
            Sign out
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-bg-light px-3 py-1.5 text-xs font-semibold text-navy"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main id="main-content" className="px-4 py-6 md:px-8 md:py-8">
          {storageWarning ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {storageWarning}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
