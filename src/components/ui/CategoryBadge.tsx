import Link from "next/link";
import type { CategorySlug } from "@/lib/site";
import { categories } from "@/lib/site";

const ACCENT_VAR: Record<CategorySlug, string> = {
  news: "var(--accent-news)",
  teorie: "var(--accent-teorie)",
  recensioni: "var(--accent-recensioni)",
  guide: "var(--accent-guide)",
};

export default function CategoryBadge({
  category,
  size = "sm",
  asLink = true,
}: {
  category: CategorySlug;
  size?: "sm" | "md";
  /** Set to false when already nested inside another link/button. */
  asLink?: boolean;
}) {
  const info = categories[category];
  const accent = ACCENT_VAR[category];

  const className = `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold uppercase tracking-wide transition-colors hover:brightness-125 ${
    size === "sm" ? "text-[11px]" : "text-xs"
  }`;
  const style = {
    color: accent,
    borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
  };
  const dot = (
    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
  );

  if (!asLink) {
    return (
      <span className={className} style={style}>
        {dot}
        {info.label}
      </span>
    );
  }

  return (
    <Link href={`/${category}`} className={className} style={style}>
      {dot}
      {info.label}
    </Link>
  );
}
