import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getPastReleases, getUpcomingReleases, type Release } from "@/lib/releases";
import { formats, siteConfig, universes } from "@/lib/site";
import UniverseBadge from "@/components/ui/UniverseBadge";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Calendario uscite Marvel e DC",
  description:
    "Tutte le date di uscita di film e serie TV Marvel (MCU) e DC Universe, aggiornate: cosa esce, quando e dove.",
  alternates: { canonical: "/calendario" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ReleaseRow({ release, past = false }: { release: Release; past?: boolean }) {
  const accent = universes[release.universe ?? "mcu"].accent;

  return (
    <li
      className={`relative flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent-primary/50 ${
        past ? "opacity-60" : ""
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <UniverseBadge universe={release.universe} />
          {release.format && (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {formats[release.format].label}
            </span>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
          {release.link ? (
            <Link href={release.link} className="hover:text-accent-primary-hover">
              {release.title}
            </Link>
          ) : (
            release.title
          )}
        </h3>

        {release.description && (
          <p className="mt-1 text-sm text-muted">{release.description}</p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium" style={{ color: accent }}>
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(release.releaseDate)}
          {release.note && (
            <span className="font-normal text-muted">· {release.note}</span>
          )}
        </p>
      </div>
    </li>
  );
}

export default function CalendarioPage() {
  const upcoming = getUpcomingReleases();
  const past = getPastReleases();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Calendario uscite Marvel e DC",
    itemListElement: upcoming.map((release, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: release.title,
      url: release.link ? `${siteConfig.url}${release.link}` : undefined,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd data={jsonLd} />

      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary">
          Sempre aggiornato
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          Calendario uscite Marvel e DC
        </h1>
        <p className="mt-3 text-muted">
          Tutte le date di uscita di film e serie TV di supereroi: cosa esce,
          quando e su quale piattaforma. Salva questa pagina nei preferiti.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">In arrivo</h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-muted">
            Nessuna data confermata al momento. Torna a trovarci presto.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {upcoming.map((release) => (
              <ReleaseRow key={release.slug} release={release} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Già uscite</h2>
          <ul className="mt-4 space-y-3">
            {past.map((release) => (
              <ReleaseRow key={release.slug} release={release} past />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
