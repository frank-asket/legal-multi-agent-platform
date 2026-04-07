"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";

/** Session controls shown in the navbar when the user is signed in (no sign-in/up here). */
export function ClerkNavbarSession({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  return (
    <SignedIn>
      {variant === "desktop" ? (
        <>
          <span className="mx-2 hidden h-6 w-px bg-white/15 md:block" aria-hidden />
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Workspace
            </Link>
            <Link
              href="/account"
              className="rounded-full px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Account
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "h-9 w-9" },
              }}
            />
          </div>
        </>
      ) : (
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <p className="px-1 text-xs font-medium uppercase tracking-wide text-white/50">
            Account
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="flex items-center rounded-xl py-3 pl-1 text-white/90"
            >
              Workspace
            </Link>
            <Link
              href="/account"
              className="flex items-center rounded-xl py-3 pl-1 text-white/90"
            >
              Account settings
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "h-10 w-10" },
              }}
            />
          </div>
        </div>
      )}
    </SignedIn>
  );
}
