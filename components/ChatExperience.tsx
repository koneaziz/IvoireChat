"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { WidgetRenderer } from "./WidgetRenderer";
import { assistantResponseSchema, type Widget } from "@/lib/widgets";

type Message = { id: string; role: "user" | "assistant"; text: string; widgets?: Widget[] };

const starterQuestions = [
  "Comment demander un passeport ?",
  "Je veux créer une entreprise",
  "Comment obtenir un extrait de naissance ?",
];

const messagesKey = "ivoirechat:messages:v1";
const widgetStateKey = "ivoirechat:widgets:v1";

function restoreMessages(): Message[] {
  try {
    const saved = JSON.parse(localStorage.getItem(messagesKey) || "[]") as unknown;
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is Message => {
      if (!item || typeof item !== "object") return false;
      const value = item as Record<string, unknown>;
      return typeof value.id === "string" && (value.role === "user" || value.role === "assistant") && typeof value.text === "string" && (!value.widgets || (Array.isArray(value.widgets) && value.widgets.every((widget) => assistantResponseSchema.shape.widgets.element.safeParse(widget).success)));
    });
  } catch { return []; }
}

function restoreWidgetState(): Record<string, unknown> {
  try {
    const value = JSON.parse(localStorage.getItem(widgetStateKey) || "{}") as unknown;
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch { return {}; }
}

export function ChatExperience() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [widgetState, setWidgetState] = useState<Record<string, unknown>>({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const initialSent = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(restoreMessages());
    setWidgetState(restoreWidgetState());
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(messagesKey, JSON.stringify(messages)); }, [messages, ready]);
  useEffect(() => { if (ready) localStorage.setItem(widgetStateKey, JSON.stringify(widgetState)); }, [widgetState, ready]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function sendMessage(value: string) {
    const question = value.trim();
    if (!question || busy) return;
    setInput("");
    setError("");
    setBusy(true);
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: question }]);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: question }) });
      if (!response.ok) throw new Error("Le service est momentanément indisponible.");
      const data = assistantResponseSchema.parse(await response.json());
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: data.message, widgets: data.widgets }]);
    } catch {
      setError("La réponse n’a pas pu être chargée. Réessayez votre question.");
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const question = params.get("q");
    if (ready && question && !initialSent.current) {
      initialSent.current = true;
      window.history.replaceState(null, "", "/chat");
      void sendMessage(question);
    }
    // The initial URL question is consumed once after local history is loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, params]);

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void sendMessage(input); }
  function changeWidgetState(id: string, value: unknown) { setWidgetState((current) => ({ ...current, [id]: value })); }
  function reset() { setMessages([]); setWidgetState({}); setError(""); localStorage.removeItem(messagesKey); localStorage.removeItem(widgetStateKey); }

  return <div className="chat-page">
    <div className="chat-banner">Démonstration · vérifiez toujours les informations sur les sites officiels</div>
    <SiteHeader compact />
    <main className="chat-main">
      <div className="chat-topline"><span className="live-dot" /> Assistant démarches <span className="chat-topline-sep">/</span> Français <button type="button" onClick={reset} className="reset-button" title="Effacer la conversation locale"><RotateCcw size={15} /> Recommencer</button></div>
      <div className="conversation" aria-live="polite">
        {messages.length === 0 && <div className="welcome-message"><div className="assistant-avatar">✳</div><div><span className="message-label">IvoireChat</span><h1>Bonjour, que souhaitez-vous faire ?</h1><p>Je peux vous guider pour trois démarches dans ce prototype. Choisissez un sujet ou posez votre question.</p><div className="starter-questions">{starterQuestions.map((question) => <button key={question} type="button" onClick={() => void sendMessage(question)} disabled={busy}>{question}<ArrowUp size={16} /></button>)}</div></div></div>}
        {messages.map((message) => <article className={`message message-${message.role}`} key={message.id}>{message.role === "assistant" && <div className="assistant-avatar">✳</div>}<div className="message-content"><span className="message-label">{message.role === "assistant" ? "IvoireChat" : "Vous"}</span><p className="message-text">{message.text}</p>{message.widgets && <div className="widget-list">{message.widgets.map((widget) => <WidgetRenderer key={widget.id} widget={widget} state={widgetState} onStateChange={changeWidgetState} onChoice={(value) => void sendMessage(value)} />)}</div>}</div></article>)}
        {busy && <div className="thinking"><div className="assistant-avatar">✳</div><span>Je prépare une réponse…</span></div>}
        {error && <div className="chat-error" role="alert">{error}</div>}
        <div ref={bottomRef} />
      </div>
    </main>
    <div className="chat-composer-wrap"><div className="chat-composer-inner"><div className="composer-context"><ShieldCheck size={15} /> Service indépendant · sources publiques officielles</div><form className="chat-composer" onSubmit={submit}><label htmlFor="chat-question" className="sr-only">Posez votre question</label><input id="chat-question" placeholder="Posez votre question…" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} disabled={busy} /><button type="submit" aria-label="Envoyer" disabled={!input.trim() || busy}><ArrowUp size={21} /></button></form><p className="composer-footnote"><Sparkles size={13} /> Réponses simulées · n’indiquez pas de données sensibles.</p></div></div>
  </div>;
}
