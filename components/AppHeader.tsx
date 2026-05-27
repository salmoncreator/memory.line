"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/reminders/new", label: "New Reminder" },
  { href: "/logs", label: "Call Logs" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f7fbfb]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          aria-label="MemoryLine home"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-lg font-bold text-white shadow-sm">
            ML
          </span>
          <span>
            <span className="block text-xl font-bold text-slate-950">
              MemoryLine
            </span>
            <span className="block text-sm font-medium text-slate-600">
              gentle voice reminders
            </span>
          </span>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
                  active
                    ? "bg-teal-700 text-white shadow-sm"
                    : "hover:bg-white hover:text-slate-950",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
