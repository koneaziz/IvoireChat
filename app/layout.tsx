import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IvoireChat — Vos démarches, en clair",
  description: "Comprendre les démarches en Côte d’Ivoire, simplement.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
