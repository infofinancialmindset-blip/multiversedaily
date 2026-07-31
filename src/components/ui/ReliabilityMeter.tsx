import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import type { Reliability } from "@/lib/content";

const LEVELS: Record<
  Reliability,
  { label: string; bars: number; accent: string; icon: typeof ShieldCheck; description: string }
> = {
  alta: {
    label: "Affidabilità alta",
    bars: 3,
    accent: "var(--accent-guide)",
    icon: ShieldCheck,
    description:
      "Fonte storicamente accurata o riscontro da più parti indipendenti.",
  },
  media: {
    label: "Affidabilità media",
    bars: 2,
    accent: "var(--accent-leak)",
    icon: ShieldQuestion,
    description:
      "Fonte plausibile ma non verificabile in modo indipendente. Da prendere con cautela.",
  },
  bassa: {
    label: "Affidabilità bassa",
    bars: 1,
    accent: "var(--accent-news)",
    icon: ShieldAlert,
    description:
      "Voce non verificata, senza fonte identificabile. Molto probabilmente infondata.",
  },
};

/**
 * Indicatore di attendibilità dei leak. Dichiarare quanto ci si può fidare di
 * un rumor è una scelta editoriale: distingue il sito da chi rilancia tutto
 * come se fosse confermato.
 */
export default function ReliabilityMeter({
  reliability,
  compact = false,
}: {
  reliability?: Reliability;
  compact?: boolean;
}) {
  if (!reliability) return null;

  const { label, bars, accent, icon: Icon, description } = LEVELS[reliability];

  const meter = (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className="h-1.5 w-5 rounded-full"
          style={{
            backgroundColor: step <= bars ? accent : "var(--border)",
          }}
        />
      ))}
    </span>
  );

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
        style={{
          color: accent,
          borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
        title={description}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
    );
  }

  return (
    <aside
      className="not-prose my-6 rounded-2xl border p-4"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Icon className="h-5 w-5 shrink-0" style={{ color: accent }} />
        <p className="font-display text-sm font-semibold" style={{ color: accent }}>
          {label}
        </p>
        {meter}
      </div>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </aside>
  );
}
