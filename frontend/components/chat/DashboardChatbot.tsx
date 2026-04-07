"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Minus, Send, Sparkles, X } from "lucide-react";
import { buildWsSessionUrl } from "@/lib/ws-session";
import { appendRunHistory, stateToRunSummary } from "@/lib/run-history";

const API_KEY_STORAGE = "legal_platform_api_key";

type ChatMsg = { id: string; role: "user" | "assistant" | "system"; text: string };

function defaultThread(): string {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "")
      : String(Date.now());
  return `chat-${id}`;
}

export function DashboardChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "system",
      text: "Short questions use the same intake → research → drafting → quality check path as the main desk. Replies stay close to your instrument’s wording.",
    },
  ]);
  const [input, setInput] = useState("");
  const [docIds, setDocIds] = useState("demo-doc");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    try {
      setApiKey(sessionStorage.getItem(API_KEY_STORAGE) || "");
    } catch {
      setApiKey("");
    }
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, status, open]);

  const send = useCallback(() => {
    const q = input.trim();
    if (!q || busy) return;
    const ids = docIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!ids.length) {
      setStatus("Add at least one file reference.");
      return;
    }

    setInput("");
    setBusy(true);
    setStatus("Connecting…");
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: q,
    };
    setMessages((m) => [...m, userMsg]);

    const runThread = defaultThread();
    const ws = new WebSocket(buildWsSessionUrl(runThread, apiKey));
    let gotResult = false;

    ws.onopen = () => {
      setStatus("Agents working…");
      ws.send(JSON.stringify({ user_query: q, document_ids: ids }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string) as {
          type: string;
          state?: Record<string, unknown>;
          detail?: string;
        };
        if (msg.type === "error") {
          setStatus("");
          setMessages((m) => [
            ...m,
            {
              id: `e-${Date.now()}`,
              role: "assistant",
              text: msg.detail || "Error",
            },
          ]);
          ws.close();
          setBusy(false);
          return;
        }
        if (msg.type === "result" && msg.state) {
          gotResult = true;
          const analyst = msg.state.analyst_answer as
            | { plain_english?: string }
            | undefined;
          const verdict = msg.state.auditor_verdict as
            | { faithful?: boolean }
            | undefined;
          const plain = (analyst?.plain_english || "").trim();
          const tag =
            verdict?.faithful === true
              ? "Source check: answer follows the file."
              : verdict?.faithful === false
                ? "Source check: senior review recommended."
                : "";
          const text = [plain.slice(0, 1200), tag].filter(Boolean).join("\n\n") || "Done (no text).";
          appendRunHistory(stateToRunSummary(msg.state, runThread, q, ids));
          setMessages((m) => [
            ...m,
            { id: `a-${Date.now()}`, role: "assistant", text },
          ]);
          setStatus("");
          ws.close();
          setBusy(false);
        }
      } catch {
        setStatus("");
        setBusy(false);
      }
    };

    ws.onerror = () => {
      setStatus("");
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "Could not reach your legal desk. Ask your administrator to confirm the service address, or try again shortly.",
        },
      ]);
      setBusy(false);
    };

    ws.onclose = (ev) => {
      if (!gotResult && ev.code !== 1000 && ev.code !== 1005) {
        setStatus("");
      }
      setBusy(false);
    };
  }, [apiKey, busy, docIds, input]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && !minimized ? (
        <div
          className="flex h-[min(32rem,calc(100vh-6rem))] w-[min(100vw-2rem,22rem)] sm:w-[24rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
          role="dialog"
          aria-label="Legal desk chat"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#0c0f14] px-3 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 opacity-90" aria-hidden />
              <span className="text-xs font-bold tracking-wide">QUICK DESK</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-white/10"
                aria-label="Minimize"
                onClick={() => setMinimized(true)}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-white/10"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl px-3 py-2 ${
                  m.role === "user"
                    ? "ml-6 bg-[#0c0f14] text-white"
                    : m.role === "system"
                      ? "bg-slate-100 text-slate-600 text-xs"
                      : "mr-4 bg-slate-50 text-[#0c0f14] ring-1 ring-slate-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            ))}
            {status ? (
              <p className="text-xs italic text-slate-500">{status}</p>
            ) : null}
          </div>
          <div className="border-t border-slate-100 p-2">
            <label className="sr-only" htmlFor="chatbot-docs">
              Document IDs
            </label>
            <input
              id="chatbot-docs"
              value={docIds}
              onChange={(e) => setDocIds(e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-[#0c0f14] outline-none focus:ring-2 focus:ring-[#0c0f14]/20"
              placeholder="File references (comma-separated, as registered)"
            />
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                className="min-w-0 flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0c0f14]/20"
                placeholder="Ask in plain language…"
                disabled={busy}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={send}
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0c0f14] text-white shadow-md transition hover:bg-slate-800 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {minimized && open ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-[#0c0f14] px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          <MessageCircle className="h-4 w-4" />
          Quick desk
        </button>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0c0f14] text-white shadow-xl shadow-slate-900/25 transition hover:bg-slate-800"
          aria-label="Open quick desk"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </button>
      ) : minimized ? null : null}
    </div>
  );
}
