import type { Article, Guide } from "./content";
import { siteConfig } from "./site";

function coverImageUrl(coverImage?: string): string[] {
  if (!coverImage) return [`${siteConfig.url}/og-default.png`];
  return [coverImage.startsWith("http") ? coverImage : `${siteConfig.url}${coverImage}`];
}

export function articleJsonLd(article: Article) {
  const type = article.category === "recensioni" ? "Review" : "NewsArticle";

  const base = {
    "@context": "https://schema.org",
    "@type": type,
    headline: article.title,
    description: article.excerpt,
    image: coverImageUrl(article.coverImage),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${article.href}`,
    },
    keywords: article.tags.join(", "),
  };

  if (type === "Review" && article.rating) {
    return {
      ...base,
      reviewRating: {
        "@type": "Rating",
        ratingValue: article.rating,
        bestRating: 10,
        worstRating: 1,
      },
      itemReviewed: {
        "@type": "Movie",
        name: article.title.replace(/^Recensione[:\s]*/i, ""),
      },
    };
  }

  return base;
}

export function guideJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    image: coverImageUrl(guide.coverImage),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: {
      "@type": "Person",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}${guide.href}`,
    },
    keywords: guide.tags.join(", "),
  };
}
