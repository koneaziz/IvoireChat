import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { StartQuestion } from "@/components/StartQuestion";

const suggestions = [
  { label: "Demander un passeport", query: "Comment demander un passeport ?" },
  { label: "Créer une entreprise", query: "Je veux créer une entreprise" },
  { label: "Extrait de naissance", query: "Comment obtenir un extrait de naissance ?" },
];

export default function HomePage() {
  return (
    <div className="home-shell">
      <div className="prototype-banner">Prototype de démonstration · informations à confirmer auprès des services officiels</div>
      <div className="home-panel">
        <SiteHeader />
        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={15} /> L’administration, en langage simple</span>
              <h1 id="hero-title">Votre démarche<br /><em>commence ici.</em></h1>
              <p>Une question, un chemin clair. Comprenez les démarches publiques en Côte d’Ivoire, étape par étape.</p>
              <StartQuestion />
              <div className="suggestions" aria-label="Questions suggérées">
                <span>Essayez par exemple</span>
                <div>
                  {suggestions.map((item) => (
                    <Link key={item.label} href={`/chat?q=${encodeURIComponent(item.query)}`}>{item.label}<ArrowRight size={15} /></Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-center"><span className="visual-spark">✳</span><span>Un chemin<br />plus clair.</span></div>
              <div className="visual-note note-top"><span className="note-icon">01</span><span>Je pose ma question</span></div>
              <div className="visual-note note-bottom"><CheckCircle2 size={21} /><span>J’avance à mon rythme</span></div>
              <div className="visual-dot dot-one" /><div className="visual-dot dot-two" />
            </div>
          </section>
          <section id="comment-ca-marche" className="how-section" aria-labelledby="how-title">
            <div className="how-intro"><span className="section-kicker">Simple, du début à la fin</span><h2 id="how-title">Moins de questions.<br /><em>Plus de clarté.</em></h2></div>
            <div className="feature-grid">
              <article className="feature-card"><div className="feature-icon"><BookOpenText size={23} /></div><h3>Comprendre</h3><p>Des réponses courtes, dans des mots de tous les jours.</p></article>
              <article className="feature-card"><div className="feature-icon"><CheckCircle2 size={23} /></div><h3>Avancer</h3><p>Des choix et des listes pour suivre votre démarche.</p></article>
              <article className="feature-card"><div className="feature-icon"><ShieldCheck size={23} /></div><h3>Vérifier</h3><p>Un lien vers la source officielle pour confirmer chaque information.</p></article>
            </div>
          </section>
        </main>
        <footer className="site-footer"><span>IvoireChat · Une façon plus simple de commencer.</span><span>Service indépendant, non affilié au gouvernement ivoirien.</span></footer>
      </div>
    </div>
  );
}
