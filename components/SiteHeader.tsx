import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <Link href="/" className="brand" aria-label="IvoireChat, accueil">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>Ivoire<span className="brand-regular">Chat</span><span className="brand-dot">.</span></span>
      </Link>
      <nav aria-label="Navigation principale">
        <Link className="header-link" href="/#comment-ca-marche">Comment ça marche</Link>
        <Link className="header-cta" href={compact ? "/" : "/chat"}>{compact ? "Accueil" : "Ouvrir le chat"} <ArrowUpRight size={17} strokeWidth={2} /></Link>
      </nav>
    </header>
  );
}
