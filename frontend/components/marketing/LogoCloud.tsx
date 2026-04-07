const PLACEHOLDERS = [
  "Northfield Counsel",
  "Atlas Compliance",
  "Meridian IR Desk",
  "Harbor Legal Ops",
  "Pacific Treaty Unit",
] as const;

export function LogoCloud() {
  return (
    <section className="border-t border-white/10 bg-[#0c0f14] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Trusted by teams running serious document review
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {PLACEHOLDERS.map((name) => (
            <span
              key={name}
              className="text-sm font-medium tracking-tight text-white/35 grayscale sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
