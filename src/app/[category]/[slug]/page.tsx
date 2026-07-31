import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Calendar } from "lucide-react";
import { ARTICLE_CATEGORIES, categories, isArticleCategory } from "@/lib/site";
import {
  coverPositionClass,
  getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  renderContent,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/schema";
import CategoryBadge from "@/components/ui/CategoryBadge";
import UniverseBadge from "@/components/ui/UniverseBadge";
import RatingBadge from "@/components/ui/RatingBadge";
import CoverPlaceholder from "@/components/ui/CoverPlaceholder";
import TagList from "@/components/ui/TagList";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButtons from "@/components/ShareButtons";
import ArticleBody from "@/components/ArticleBody";
import RelatedArticles from "@/components/RelatedArticles";
import WhereToWatchBox from "@/components/WhereToWatchBox";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/ads/AdSlot";

export function generateStaticParams() {
  return ARTICLE_CATEGORIES.flatMap((category) =>
    getArticlesByCategory(category).map((article) => ({
      category,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isArticleCategory(category)) return {};

  const article = getArticleBySlug(category, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: article.href },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  if (!isArticleCategory(category)) notFound();

  const article = getArticleBySlug(category, slug);
  if (!article) notFound();

  const [html, related] = await Promise.all([
    renderContent(article),
    Promise.resolve(getRelatedArticles(article)),
  ]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={articleJsonLd(article)} />

      <Breadcrumbs
        items={[
          { label: categories[category].label, href: `/${category}` },
          { label: article.title },
        ]}
      />

      <div className="flex flex-wrap items-center gap-3">
        <UniverseBadge universe={article.universe} size="md" />
        <CategoryBadge category={category} size="md" />
        {category === "recensioni" && article.rating && (
          <RatingBadge rating={article.rating} />
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{article.excerpt}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span>Di {article.author}</span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formatDate(article.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {article.readingTimeText}
        </span>
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className={`object-cover ${coverPositionClass(article.coverPosition)}`}
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

      <div className="mt-8">
        <ArticleBody html={html} />
      </div>

      {article.whereToWatch && (
        <WhereToWatchBox entries={article.whereToWatch} />
      )}

      <div className="mt-8 flex flex-col gap-4 border-y border-border py-6 sm:flex-row sm:items-center sm:justify-between">
        <TagList tags={article.tags} />
        <ShareButtons path={article.href} title={article.title} />
      </div>

      <AdSlot id="article-bottom" className="mt-8" />

      <RelatedArticles articles={related} />
    </article>
  );
}
