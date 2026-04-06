import { getWsBase } from "./api";

/** Build WebSocket URL for LangGraph session streaming (same contract as InquiryConsole). */
export function buildWsSessionUrl(threadId: string, apiKey: string): string {
  const path = `/ws/session/${encodeURIComponent(threadId)}`;
  const base = getWsBase();
  if (apiKey.trim()) {
    return `${base}${path}?api_key=${encodeURIComponent(apiKey.trim())}`;
  }
  return `${base}${path}`;
}
