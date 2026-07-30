import Link from "next/link";
import { universes, type Universe } from "@/lib/site";

/**
 * Etichetta dell'universo (Marvel / DC). Il colore è ridondante rispetto al
 * testo di proposito: chi non distingue i colori legge comunque l'universo.
 */
export default function UniverseBadge({
  universe,
  size = "sm",
  asLink = true,
}: {
  universe?: Universe;
  size?: "sm" | "md";
  /** Set to false when already nested inside another link/button. */
  asLink?: boolean;
}) {
  if (!universe) return null;

  const { shortLabel, accent, section } = universes[universe];

  const className = `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold uppercase tracking-wider text-white ${
    size === "sm" ? "text-[10px]" : "text-[11px]"
  }`;
  const style = { backgroundColor: accent };

  if (!asLink || !section) {
    return (
      <span className={className} style={style}>
        {shortLabel}
      </span>
    );
  }

  return (
    <Link
      href={`/${section}`}
      className={`${className} transition-opacity hover:opacity-85`}
      style={style}
    >
      {shortLabel}
    </Link>
  );
}
