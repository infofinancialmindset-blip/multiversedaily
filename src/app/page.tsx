import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import {
  getAllArticles,
  getArticlesByCategory,
  getFeaturedArticles,
  getFeaturedGuides,
} from "@/lib/content";
import ArticleCard from "@/components/ArticleCard";
import GuideCard from "@/components/GuideCard";
import CategoryBadge from "@/components/ui/CategoryBadge";
import UniverseBadge from "@/components/ui/UniverseBadge";
import CoverPlaceholder from "@/components/ui/CoverPlaceholder";
import AdSlot from "@/components/ads/AdSlot";

export default function HomePage() {
  const [hero, ...featuredRest] = getFeaturedArticles(4);
  const latestNews = getArticlesByCategory("news").slice(0, 4);
  const guides = getFeaturedGuides(3);
  const latest = getAllArticles().slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero */}
      {hero && (
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Link
            href={hero.href}
            className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-border"
          >
            {hero.coverImage ? (
              <Image
                src={hero.coverImage}
                alt={hero.title}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <CoverPlaceholder
                category={hero.category}
                universe={hero.universe}
                title={hero.title}
                className="absolute inset-0"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="relative p-6">
              <div className="flex flex-wrap items-center gap-2">
                <UniverseBadge
                  universe={hero.universe}
                  size="md"
                  asLink={false}
                />
                <CategoryBadge
                  category={hero.category}
                  size="md"
                  asLink={false}
                />
              </div>
              <h1 className="mt-3 max-w-xl font-display text-2xl font-bold leading-tight sm:text-3xl">
                {hero.title}
              </h1>
              <p className="mt-2 max-w-lg text-sm text-muted">{hero.excerpt}</p>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {featuredRest.slice(0, 3).map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent-primary/60"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="112px"
                      className="object-cover"
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
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <UniverseBadge universe={article.universe} asLink={false} />
                    <CategoryBadge category={article.category} asLink={false} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-accent-primary-hover">
                    {article.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    {article.readingTimeText}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Guide evergreen in rilievo */}
      {guides.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Guide evergreen</h2>
            <Link
              href="/guide"
              className="flex items-center gap-1 text-sm font-medium text-accent-guide hover:underline"
            >
              Tutte le guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted">
            I riferimenti da tenere sempre a portata di mano: ordini
            cronologici, dove guardare, spiegazioni delle fasi MCU.
          </p>
          <div className="mt-5 grid gap-5">
            {guides.map((guide) => (
              <GuideCard key={guide.href} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* Ultime news */}
      {latestNews.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Ultime news</h2>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm font-medium text-accent-news hover:underline"
            >
              Tutte le news <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestNews.map((article) => (
              <ArticleCard key={article.href} article={article} />
            ))}
          </div>
        </section>
      )}

      <AdSlot id="home-feed" className="mt-14" />

      {/* Ultimi articoli (tutte le categorie) */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Dal blog</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.href} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
