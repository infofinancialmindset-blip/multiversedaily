"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { Release } from "@/lib/releases";
import { universes } from "@/lib/site";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingUntil(iso: string, now: number): Remaining | null {
  const diff = new Date(`${iso}T00:00:00`).getTime() - now;
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  );
}

/** Si aggiorna una volta al secondo. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

/** Secondi interi: un primitivo, quindi confrontabile senza rerender inutili. */
const getSnapshot = () => Math.floor(Date.now() / 1000);

/** Durante il prerendering non esiste un "adesso": 0 significa "non montato". */
const getServerSnapshot = () => 0;

/**
 * Conto alla rovescia verso la prossima uscita. Il tempo residuo dipende
 * dall'orologio del visitatore, quindi in fase di prerendering mostriamo solo
 * la data: così l'HTML generato e quello del browser coincidono.
 */
export default function ReleaseCountdown({ release }: { release: Release }) {
  const nowSeconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const mounted = nowSeconds > 0;
  const remaining = mounted
    ? remainingUntil(release.releaseDate, nowSeconds * 1000)
    : null;

  const accent = universes[release.universe ?? "mcu"].accent;
  const formattedDate = new Date(
    `${release.releaseDate}T00:00:00`,
  ).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border p-5 sm:p-6"
      style={{
        backgroundImage: `radial-gradient(circle at 12% 0%, color-mix(in srgb, ${accent} 22%, transparent), transparent 55%), linear-gradient(160deg, var(--surface), var(--background-elevated))`,
      }}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: accent }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Prossima uscita
          </p>
          <h2 className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl">
            {release.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {formattedDate}
            {release.note ? ` · ${release.note}` : ""}
          </p>
        </div>

        <div className="shrink-0">
          {mounted && remaining ? (
            <div className="flex gap-4 sm:gap-5" aria-live="off">
              <Unit value={remaining.days} label="giorni" />
              <Unit value={remaining.hours} label="ore" />
              <Unit value={remaining.minutes} label="min" />
              <Unit value={remaining.seconds} label="sec" />
            </div>
          ) : (
            <p className="font-display text-lg font-semibold text-muted">
              {formattedDate}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm">
        {release.link && (
          <Link
            href={release.link}
            className="font-medium hover:underline"
            style={{ color: accent }}
          >
            Leggi l&apos;ultimo aggiornamento
          </Link>
        )}
        <Link
          href="/calendario"
          className="ml-auto flex items-center gap-1 font-medium text-muted transition-colors hover:text-foreground"
        >
          Tutte le uscite <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
