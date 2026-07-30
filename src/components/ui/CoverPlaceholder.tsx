import { Clapperboard } from "lucide-react";
import {
  categories,
  universes,
  type CategorySlug,
  type Universe,
} from "@/lib/site";

/**
 * Copertina segnaposto usata quando un contenuto non ha `coverImage`.
 * La tinta segue l'universo (rosso Marvel / blu DC) così la provenienza è
 * leggibile a colpo d'occhio; senza universo ricade sul colore di categoria.
 */
export default function CoverPlaceholder({
  category,
  universe,
  title,
  className = "",
}: {
  category: CategorySlug;
  universe?: Universe;
  title: string;
  className?: string;
}) {
  const accent = universe
    ? universes[universe].accent
    : categories[category].accent;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${accent} 35%, transparent), transparent 60%), linear-gradient(160deg, var(--surface), var(--background-elevated))`,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)",
          color: accent,
        }}
      />
      <Clapperboard
        className="relative h-10 w-10 shrink-0 opacity-40 sm:h-14 sm:w-14"
        style={{ color: accent }}
        strokeWidth={1.5}
      />
      <span className="sr-only">{title}</span>
    </div>
  );
}
