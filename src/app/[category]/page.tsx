import { Fragment } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLE_CATEGORIES, categories, isArticleCategory } from "@/lib/site";
import { getArticlesByCategory } from "@/lib/content";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";

export function generateStaticParams() {
  return ARTICLE_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isArticleCategory(category)) return {};

  const info = categories[category];
  return {
    title: info.label,
    description: info.description,
    alternates: { canonical: `/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isArticleCategory(category)) notFound();

  const info = categories[category];
  const articles = getArticlesByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {info.label}
        </h1>
        <p className="mt-3 text-muted">{info.description}</p>
      </header>

      {articles.length === 0 ? (
        <p className="mt-10 text-muted">
          Nessun articolo pubblicato ancora in questa sezione.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Fragment key={article.href}>
              <ArticleCard article={article} priority={index === 0} />
              {index === 5 && (
                <AdSlot
                  id="home-feed"
                  className="sm:col-span-2 lg:col-span-3"
                />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
