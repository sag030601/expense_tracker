"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  // Optional: pass data for richer answers
  context?: any;
  title?: string;
};

export default function ChatAssistant({ context, title = "Finance Chatbot" }: Props) {
  const [open, setOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, open]);

  const sendChat = async () => {
    if (!chatInput.trim() || loading) return;
    const text = chatInput.trim();
    setChatInput("");
    setChatLog((l) => [...l, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, transactions: context ?? [] }),
      });
      const data = await res.json();
      setChatLog((l) => [...l, { role: "assistant", content: data.reply ?? "…" }]);
    } catch {
      setChatLog((l) => [...l, { role: "assistant", content: "Couldn’t reach the AI. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What am I overspending on?",
    "One-line summary for this month",
    "How to save ₹5,000 next month?",
  ];

  return (
    <>
      {/* Floating Button (animated) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open chatbot"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg
                   flex items-center justify-center hover:bg-blue-700 transition
                   animate-bounce"
        title="Chat with your AI assistant"
      >
        {/* Cute emoji avatar; swap with an <img> if you like */}
        <span className="text-2xl">🤖</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Modal / Drawer */}
      <div
        className={`fixed z-50 right-4 bottom-20 w-[95%] max-w-xl
                    transition-all ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <h3 className="font-semibold">{title}</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2 flex gap-2 flex-wrap bg-gray-50 border-b">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setChatInput(p)}
                className="text-xs px-2 py-1 rounded bg-white border hover:bg-gray-100"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="px-4 py-3 h-72 overflow-y-auto bg-gray-50 space-y-3">
            {chatLog.length === 0 && (
              <div className="text-sm text-gray-500">
                Ask me about your spending, trends, or goals. I’ll use your transactions for context.
              </div>
            )}

            {chatLog.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow
                    ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border"
                    }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && <div className="text-gray-500 text-sm">Thinking…</div>}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="px-3 py-3 bg-white border-t flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your question…"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendChat()}
            />
            <button
              onClick={sendChat}
              disabled={loading}
              className={`px-4 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
