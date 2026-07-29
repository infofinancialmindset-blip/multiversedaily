import { PlayCircle } from "lucide-react";
import type { WhereToWatchEntry } from "@/lib/content";

/**
 * Box "Dove guardarlo": pensato per link di affiliazione streaming.
 * Aggiungi `rel="sponsored"` è già impostato: quando avrai i link affiliati
 * reali (Amazon Prime, Disney+, JustWatch, ecc.) basta incollarli nel
 * frontmatter `whereToWatch` dell'articolo/guida.
 */
export default function WhereToWatchBox({
  entries,
}: {
  entries: WhereToWatchEntry[];
}) {
  if (!entries || entries.length === 0) return null;

  return (
    <aside className="not-prose my-8 rounded-2xl border border-accent-guide/30 bg-accent-guide/[0.06] p-5">
      <p className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
        <PlayCircle className="h-5 w-5 text-accent-guide" />
        Dove guardarlo
      </p>
      <ul className="mt-4 space-y-2">
        {entries.map((entry) => (
          <li key={entry.platform}>
            <a
              href={entry.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-accent-guide/60"
            >
              <span className="font-medium text-foreground">{entry.platform}</span>
              <span className="text-xs text-muted">
                {entry.note ?? "Guarda ora"} →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted">
        Alcuni link potrebbero essere di affiliazione: potremmo ricevere una
        piccola commissione senza costi aggiuntivi per te.
      </p>
    </aside>
  );
}
