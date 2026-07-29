import Link from "next/link";
import Image from "next/image";
import { RefreshCw, Sparkles } from "lucide-react";
import type { Guide } from "@/lib/content";
import { formatDateShort } from "@/lib/format";
import CoverPlaceholder from "@/components/ui/CoverPlaceholder";

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-accent-guide/30 bg-gradient-to-b from-accent-guide/[0.06] to-surface transition-colors hover:border-accent-guide/70 sm:flex-row">
      <Link href={guide.href} className="relative block aspect-[16/9] w-full shrink-0 sm:aspect-square sm:w-48">
        {guide.coverImage ? (
          <Image
            src={guide.coverImage}
            alt={guide.title}
            fill
            sizes="(min-width: 640px) 192px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CoverPlaceholder category="guide" title={guide.title} className="absolute inset-0" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-guide/40 bg-accent-guide/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-guide">
          <Sparkles className="h-3 w-3" />
          Guida evergreen
        </span>
        <h3 className="font-display text-lg font-semibold leading-snug">
          <Link href={guide.href} className="hover:text-accent-guide">
            {guide.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{guide.excerpt}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
          <RefreshCw className="h-3.5 w-3.5" />
          Aggiornata il {formatDateShort(guide.updatedAt ?? guide.publishedAt)}
        </div>
      </div>
    </article>
  );
}
