import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { coverPositionClass, type Article } from "@/lib/content";
import { formatDateShort } from "@/lib/format";
import CategoryBadge from "@/components/ui/CategoryBadge";
import UniverseBadge from "@/components/ui/UniverseBadge";
import CoverPlaceholder from "@/components/ui/CoverPlaceholder";

export default function ArticleCard({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent-primary/60">
      <Link href={article.href} className="block">
        <div className="relative aspect-[16/9] w-full">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`object-cover ${coverPositionClass(article.coverPosition)} transition-transform duration-300 group-hover:scale-105`}
            />
          ) : (
            <CoverPlaceholder
              category={article.category}
              universe={article.universe}
              title={article.title}
              className="absolute inset-0"
            />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <UniverseBadge universe={article.universe} />
          <CategoryBadge category={article.category} />
          <span className="ml-auto flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTimeText}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
          <Link href={article.href} className="hover:text-accent-primary-hover">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted">
          <span>{formatDateShort(article.publishedAt)}</span>
          <span>{article.author}</span>
        </div>
      </div>
    </article>
  );
}
