/** Browser-accessible API origin (FastAPI). */
export function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://127.0.0.1:8010";
  return raw.replace(/\/$/, "");
}

export function getWsBase(): string {
  const http = getApiBase();
  if (http.startsWith("https://")) return http.replace(/^https/, "wss");
  return http.replace(/^http/, "ws");
}

export function apiDocsUrl(): string {
  return `${getApiBase()}/docs`;
}
