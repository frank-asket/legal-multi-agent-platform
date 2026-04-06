"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function DashboardUserMenu() {
  return (
    <div className="fixed right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-5 lg:right-8 lg:top-6">
      <Link
        href="/"
        className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 sm:inline-block"
      >
        Marketing site
      </Link>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: { avatarBox: "h-9 w-9 ring-2 ring-white shadow-md" },
        }}
      />
    </div>
  );
}
