import type { MetadataRoute } from "next";
import { getAllArticles, getAllGuides, getAllTags, tagToSlug } from "@/lib/content";
import { ARTICLE_CATEGORIES, sections, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/guide`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/teorie`, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteConfig.url}/chi-siamo`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/contatti`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Sezioni trasversali (MCU, Film, Serie TV, DC Universe): sono le landing
  // page principali per la ricerca, quindi priorità alta.
  const sectionRoutes: MetadataRoute.Sitemap = Object.keys(sections).map(
    (slug) => ({
      url: `${siteConfig.url}/${slug}`,
      changeFrequency: "daily",
      priority: 0.9,
    }),
  );

  const categoryRoutes: MetadataRoute.Sitemap = ARTICLE_CATEGORIES.map(
    (category) => ({
      url: `${siteConfig.url}/${category}`,
      changeFrequency: category === "news" ? "hourly" : "daily",
      priority: 0.8,
    }),
  );

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${siteConfig.url}${article.href}`,
    lastModified: article.updatedAt ?? article.publishedAt,
    changeFrequency: article.category === "news" ? "daily" : "weekly",
    priority: 0.6,
  }));

  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${siteConfig.url}${guide.href}`,
    lastModified: guide.updatedAt ?? guide.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${siteConfig.url}/tag/${tagToSlug(tag)}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...sectionRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...guideRoutes,
    ...tagRoutes,
  ];
}
