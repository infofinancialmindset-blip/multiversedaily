import type { ContentItem } from "@/lib/content";
import ArticleCard from "@/components/ArticleCard";
import GuideCard from "@/components/GuideCard";

/**
 * Griglia mista di articoli e guide, usata dalle pagine-raccolta (sezioni e
 * tag). Le guide occupano tutta la riga per distinguerle dagli articoli.
 */
export default function ContentGrid({
  items,
  emptyMessage = "Nessun contenuto pubblicato ancora in questa sezione.",
}: {
  items: ContentItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <p className="mt-10 text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) =>
        item.kind === "guide" ? (
          <div key={item.href} className="sm:col-span-2 lg:col-span-3">
            <GuideCard guide={item} />
          </div>
        ) : (
          <ArticleCard key={item.href} article={item} />
        ),
      )}
    </div>
  );
}
