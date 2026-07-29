import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatta la redazione di ${siteConfig.name} per segnalazioni, correzioni, collaborazioni o richieste pubblicitarie.`,
  alternates: { canonical: "/contatti" },
};

const REASONS = [
  {
    title: "Segnalazioni ed errori",
    description:
      "Hai notato un refuso o un'informazione non aggiornata? Aiutaci a correggerla.",
  },
  {
    title: "Collaborazioni editoriali",
    description:
      "Scrivi per noi o proponi una collaborazione come autore o autrice.",
  },
  {
    title: "Pubblicità e sponsorizzazioni",
    description:
      "Richiedi il nostro media kit per inserzioni pubblicitarie o sponsorizzazioni.",
  },
];

export default function ContattiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Contatti</h1>
      <p className="mt-3 max-w-xl text-muted">
        Scrivici per una delle seguenti ragioni, oppure semplicemente per
        dirci cosa vorresti leggere sul sito.
      </p>

      <a
        href={`mailto:${siteConfig.founderEmail}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
      >
        <Mail className="h-4 w-4" />
        {siteConfig.founderEmail}
      </a>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {REASONS.map((reason) => (
          <div
            key={reason.title}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <p className="font-semibold text-foreground">{reason.title}</p>
            <p className="mt-1.5 text-sm text-muted">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
