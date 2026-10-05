"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export function StartQuestion() {
  const router = useRouter();
  const [question, setQuestion] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = question.trim();
    if (value) router.push(`/chat?q=${encodeURIComponent(value)}`);
  }

  return (
    <form className="start-form" onSubmit={submit}>
      <Search size={21} strokeWidth={1.8} aria-hidden="true" />
      <label className="sr-only" htmlFor="start-question">Que voulez-vous faire ?</label>
      <input id="start-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder="Posez votre question..." />
      <button type="submit" aria-label="Poser la question" disabled={!question.trim()}><ArrowUpRight size={22} strokeWidth={2} /></button>
    </form>
  );
}
