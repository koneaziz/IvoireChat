import { Suspense } from "react";
import { ChatExperience } from "@/components/ChatExperience";

export default function ChatPage() {
  return <Suspense fallback={<main className="chat-loading">Ouverture de la conversation…</main>}><ChatExperience /></Suspense>;
}
