/**
 * Persist recent agent runs in localStorage so the dashboard can show real activity
 * (the API has no history endpoint).
 */

export type RunHistoryEntry = {
  id: string;
  at: number;
  threadId: string;
  query: string;
  documentIds: string[];
  faithful: boolean | null;
  faithfulnessScore: number | null;
  agents: string[];
  chunkDocCount: number;
};

const STORAGE_KEY = "legal_platform_run_history";
const MAX_ENTRIES = 30;

function uniqueAgentsFromLog(log: unknown): string[] {
  if (!Array.isArray(log)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of log) {
    if (!e || typeof e !== "object") continue;
    const a = (e as { agent?: string }).agent;
    if (typeof a === "string" && a && !seen.has(a)) {
      seen.add(a);
      out.push(a);
    }
  }
  return out;
}

/** Slim API may send chunk counts per document as numbers. */
function totalChunkCount(chunks: unknown): number {
  if (!chunks || typeof chunks !== "object") return 0;
  let n = 0;
  for (const v of Object.values(chunks as Record<string, unknown>)) {
    if (typeof v === "number") n += v;
    else if (Array.isArray(v)) n += v.length;
  }
  return n;
}

export function loadRunHistory(): RunHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RunHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendRunHistory(
  entry: Omit<RunHistoryEntry, "id" | "at"> & { id?: string },
): void {
  if (typeof window === "undefined") return;
  const full: RunHistoryEntry = {
    id:
      entry.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now())),
    at: Date.now(),
    threadId: entry.threadId,
    query: entry.query,
    documentIds: entry.documentIds,
    faithful: entry.faithful,
    faithfulnessScore: entry.faithfulnessScore,
    agents: entry.agents,
    chunkDocCount: entry.chunkDocCount,
  };
  const prev = loadRunHistory();
  const next = [full, ...prev].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
  try {
    window.dispatchEvent(new Event("legal-platform-run-history"));
  } catch {
    /* ignore */
  }
}

export function stateToRunSummary(
  state: Record<string, unknown>,
  threadId: string,
  query: string,
  documentIds: string[],
): Omit<RunHistoryEntry, "id" | "at"> {
  const verdict = state.auditor_verdict as
          | { faithful?: boolean; faithfulness_score?: number }
          | undefined;
  const log = state.status_log;
  const chunks = state.chunks_by_document;
  return {
    threadId,
    query: query.slice(0, 480),
    documentIds,
    faithful: typeof verdict?.faithful === "boolean" ? verdict.faithful : null,
    faithfulnessScore:
      typeof verdict?.faithfulness_score === "number"
        ? verdict.faithfulness_score
        : null,
    agents: uniqueAgentsFromLog(log),
    chunkDocCount: totalChunkCount(chunks),
  };
}
