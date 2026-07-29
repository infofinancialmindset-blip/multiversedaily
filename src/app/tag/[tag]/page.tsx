import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  findTagBySlug,
  getAllTagSlugs,
  getContentByTag,
} from "@/lib/content";
import ArticleCard from "@/components/ArticleCard";
import GuideCard from "@/components/GuideCard";

export function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = findTagBySlug(tagSlug);
  if (!tag) return {};

  return {
    title: `#${tag}`,
    description: `Tutti gli articoli e le guide su ${tag}.`,
    alternates: { canonical: `/tag/${tagSlug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagSlug } = await params;
  const tag = findTagBySlug(tagSlug);
  if (!tag) notFound();

  const items = getContentByTag(tag);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary">
          Tag
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          #{tag}
        </h1>
        <p className="mt-3 text-muted">
          {items.length} {items.length === 1 ? "contenuto trovato" : "contenuti trovati"}
        </p>
      </header>

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
    </div>
  );
}
