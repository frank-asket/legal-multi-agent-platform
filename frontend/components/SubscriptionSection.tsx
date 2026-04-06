"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  CheckoutButton,
  SubscriptionDetailsButton,
} from "@clerk/nextjs/experimental";
import Link from "next/link";

const planId = process.env.NEXT_PUBLIC_CLERK_CHECKOUT_PLAN_ID?.trim();

export function SubscriptionSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0c0f14]">Subscription</h2>
      <p className="mt-2 text-sm text-slate-600">
        Clerk Billing (beta) powers plans and checkout. In the Clerk Dashboard,
        create a plan and connect payments, then set{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
          NEXT_PUBLIC_CLERK_CHECKOUT_PLAN_ID
        </code>{" "}
        to your plan ID so the button below appears.
      </p>

      <SignedOut>
        <p className="mt-4 text-sm text-slate-500">
          <Link href="/sign-in" className="font-medium text-[#0c0f14] underline">
            Sign in
          </Link>{" "}
          to manage or start a subscription.
        </p>
      </SignedOut>

      <SignedIn>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {planId ? (
            <CheckoutButton planId={planId} planPeriod="month">
              <button
                type="button"
                className="rounded-full bg-[#0c0f14] px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Subscribe (monthly)
              </button>
            </CheckoutButton>
          ) : (
            <p className="text-sm text-amber-800">
              Set NEXT_PUBLIC_CLERK_CHECKOUT_PLAN_ID to enable checkout for a
              specific plan.
            </p>
          )}
          {planId ? (
            <SubscriptionDetailsButton>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Current subscription
              </button>
            </SubscriptionDetailsButton>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Checkout and subscription UI are experimental Clerk APIs; pin SDK
          versions for production. See{" "}
          <a
            href="https://clerk.com/docs/billing/overview"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Clerk Billing docs
          </a>
          .
        </p>
      </SignedIn>
    </section>
  );
}