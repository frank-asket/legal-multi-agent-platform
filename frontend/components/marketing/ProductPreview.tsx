"use client";

/** Stylized product chrome — evokes dashboard without claiming a real screenshot. */
export function ProductPreview() {
  return (
    <div className="mx-auto mt-14 max-w-5xl px-2 sm:mt-16 sm:px-0">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-1 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:rounded-3xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-white/35">
            Workspace preview
          </span>
        </div>
        <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="border-r-0 border-white/10 p-5 md:border-r md:p-6">
            <p className="text-lg font-semibold text-white sm:text-xl">Hello — pick a next step</p>
            <p className="mt-2 text-sm text-white/55">
              Pin a jurisdiction, run the desk on a matter file, or open review history.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Matter</p>
                <p className="mt-2 text-sm font-medium text-white">New review session</p>
                <p className="mt-1 text-xs text-white/45">Grounded Q&amp;A with citations</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Report</p>
                <p className="mt-2 text-sm font-medium text-white">Clause summary draft</p>
                <p className="mt-1 text-xs text-white/45">Export-ready outline</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Vault</p>
                <p className="mt-2 text-sm font-medium text-white">Register documents</p>
                <p className="mt-1 text-xs text-white/45">Instrument IDs &amp; access</p>
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Desk</p>
                <p className="mt-2 text-sm font-medium text-white">Open quick chat</p>
                <p className="mt-1 text-xs text-white/45">Plain-language prompts</p>
              </button>
            </div>
          </div>
          <div className="hidden flex-col border-t border-white/10 p-5 md:flex md:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Activity</p>
            <ul className="mt-4 space-y-3 text-xs text-white/55">
              <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                Source check — aligned
              </li>
              <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                3 citations attached
              </li>
              <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                Playbook: 2 flags
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
