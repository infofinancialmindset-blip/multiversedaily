import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, RefreshCw } from "lucide-react";
import { categories } from "@/lib/site";
import {
  coverPositionClass,
  getAllGuides,
  getGuideBySlug,
  renderContent,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { guideJsonLd } from "@/lib/schema";
import CoverPlaceholder from "@/components/ui/CoverPlaceholder";
import UniverseBadge from "@/components/ui/UniverseBadge";
import TagList from "@/components/ui/TagList";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButtons from "@/components/ShareButtons";
import ArticleBody from "@/components/ArticleBody";
import ReadingProgress from "@/components/ReadingProgress";
import WhereToWatchBox from "@/components/WhereToWatchBox";
import GuideCard from "@/components/GuideCard";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/ads/AdSlot";

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: guide.href },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.excerpt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
      images: guide.coverImage ? [guide.coverImage] : undefined,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const html = await renderContent(guide);
  const otherGuides = getAllGuides()
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={guideJsonLd(guide)} />
      <ReadingProgress />

      <Breadcrumbs
        items={[
          { label: categories.guide.label, href: "/guide" },
          { label: guide.title },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <UniverseBadge universe={guide.universe} size="md" />
      </div>

      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-lg text-muted">{guide.excerpt}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-accent-guide/30 bg-accent-guide/[0.06] px-4 py-3 text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-accent-guide">
          <RefreshCw className="h-4 w-4" />
          Aggiornata il {formatDate(guide.updatedAt ?? guide.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <Clock className="h-4 w-4" />
          {guide.readingTimeText}
        </span>
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
        {guide.coverImage ? (
          <Image
            src={guide.coverImage}
            alt={guide.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className={`object-cover ${coverPositionClass(guide.coverPosition)}`}
          />
        ) : (
          <CoverPlaceholder
            category="guide"
            universe={guide.universe}
            title={guide.title}
            className="absolute inset-0"
          />
        )}
      </div>

      <div className="mt-8">
        <ArticleBody html={html} />
      </div>

      {guide.whereToWatch && <WhereToWatchBox entries={guide.whereToWatch} />}

      <div className="mt-8 flex flex-col gap-4 border-y border-border py-6 sm:flex-row sm:items-center sm:justify-between">
        <TagList tags={guide.tags} />
        <ShareButtons path={guide.href} title={guide.title} />
      </div>

      <AdSlot id="article-bottom" className="mt-8" />

      {otherGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Altre guide</h2>
          <div className="mt-4 grid gap-5">
            {otherGuides.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
