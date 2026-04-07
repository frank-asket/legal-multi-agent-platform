"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  priceMonthly: number;
  description: string;
  cta: string;
  href: string;
  highlighted?: boolean;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Basic",
    priceMonthly: 49,
    description: "For individuals and small matters testing grounded review.",
    cta: "Get started",
    href: "/sign-up",
    features: [
      "Desk access with sample corpus",
      "HTTP and WebSocket runs",
      "Citation-style answer layout",
      "Email support (best effort)",
    ],
  },
  {
    name: "Standard",
    priceMonthly: 149,
    description: "For teams routing multiple matters through a shared workspace.",
    cta: "Get started",
    href: "/sign-up",
    highlighted: true,
    features: [
      "Everything in Basic",
      "Higher concurrency for org keys",
      "Session references & history",
      "Priority integration guidance",
    ],
  },
  {
    name: "Professional",
    priceMonthly: 0,
    description: "For enterprises needing SSO, custom retention, and panel counsel hooks.",
    cta: "Talk to us",
    href: "#consultation",
    features: [
      "Dedicated environment options",
      "Custom ingestion & vault wiring",
      "Security review pack",
      "Named success engineer",
    ],
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  const displayPrice = useMemo(
    () => (m: number) => {
      if (m === 0) return null;
      const v = yearly ? Math.round(m * 10 * 0.85) / 10 : m;
      return v;
    },
    [yearly],
  );

  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#0c0f14] sm:text-3xl md:text-4xl">
            Plans that scale with your matter load
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Illustrative pricing for the marketing site — confirm with your deployment team before publishing live numbers
            or linking a billing provider.
          </p>
          <div
            className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-[#fafbfc] p-1.5 pl-4"
            role="group"
            aria-label="Billing period"
          >
            <span className={`text-xs font-medium ${!yearly ? "text-[#0c0f14]" : "text-slate-500"}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setYearly((v) => !v)}
              className="relative h-8 w-14 rounded-full bg-[#0c0f14] transition"
              aria-pressed={yearly}
              aria-label={yearly ? "Switch to monthly" : "Switch to yearly"}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                  yearly ? "left-7" : "left-1"
                }`}
              />
            </button>
            <span className={`pr-3 text-xs font-medium ${yearly ? "text-[#0c0f14]" : "text-slate-500"}`}>
              Yearly <span className="text-slate-400">(~15% off)</span>
            </span>
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {TIERS.map((tier) => {
            const price = displayPrice(tier.priceMonthly);
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 sm:p-8 ${
                  tier.highlighted
                    ? "border-[#0c0f14] bg-[#0c0f14] text-white shadow-xl shadow-black/15"
                    : "border-slate-200 bg-[#fafbfc]"
                }`}
              >
                <h3 className={`text-lg font-semibold ${tier.highlighted ? "text-white" : "text-[#0c0f14]"}`}>
                  {tier.name}
                </h3>
                <p className={`mt-2 text-sm ${tier.highlighted ? "text-white/75" : "text-slate-600"}`}>
                  {tier.description}
                </p>
                <div className="mt-6">
                  {price != null ? (
                    <p className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tabular-nums">{`$${price}`}</span>
                      <span className={tier.highlighted ? "text-sm text-white/60" : "text-sm text-slate-500"}>
                        / seat / mo
                      </span>
                    </p>
                  ) : (
                    <p className="text-3xl font-semibold">Custom</p>
                  )}
                </div>
                <Link
                  href={tier.href}
                  className={`mt-6 inline-flex items-center justify-center rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                    tier.highlighted
                      ? "bg-white text-[#0c0f14] hover:bg-slate-100"
                      : "border border-slate-300 bg-white text-[#0c0f14] hover:border-slate-400"
                  }`}
                >
                  {tier.cta}
                </Link>
                <ul className="mt-8 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check
                        className={`h-4 w-4 shrink-0 ${tier.highlighted ? "text-white" : "text-[#0c0f14]"}`}
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className={tier.highlighted ? "text-white/85" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
