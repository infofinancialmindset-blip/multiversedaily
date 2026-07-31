import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { markdownToHtml } from "./markdown";
import {
  ARTICLE_CATEGORIES,
  sections,
  type ArticleCategorySlug,
  type ContentFormat,
  type SectionSlug,
  type Universe,
} from "./site";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const GUIDES_DIR = path.join(CONTENT_DIR, "guide");

export type WhereToWatchEntry = {
  platform: string;
  url: string;
  note?: string;
};

export type CoverPosition = "top" | "center" | "bottom";

/** Quanto è attendibile un leak. Usato solo dalla categoria "leak". */
export type Reliability = "alta" | "media" | "bassa";

/**
 * Classi Tailwind statiche: vanno scritte per esteso, altrimenti non
 * finiscono nel CSS generato.
 */
const COVER_POSITION_CLASS: Record<CoverPosition, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export function coverPositionClass(position?: CoverPosition): string {
  return COVER_POSITION_CLASS[position ?? "center"];
}

type FrontmatterBase = {
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  coverImage?: string;
  /**
   * Quale parte della copertina resta visibile nel ritaglio 16:9. Utile per
   * le foto verticali, dove il centro taglierebbe via i volti.
   */
  coverPosition?: CoverPosition;
  featured?: boolean;
  /**
   * Posizione in prima pagina: 1 = primo articolo in evidenza. Se vuoto,
   * l'articolo si ordina per data dopo quelli numerati.
   */
  featuredOrder?: number;
  /** Universo narrativo: alimenta le sezioni /mcu e /dc-universe. */
  universe?: Universe;
  /** Formato: alimenta le sezioni /film e /serie-tv. */
  format?: ContentFormat;
  whereToWatch?: WhereToWatchEntry[];
};

type ArticleFrontmatter = FrontmatterBase & {
  rating?: number;
  /** Solo per i leak: quanto è attendibile l'indiscrezione. */
  reliability?: Reliability;
};

type GuideFrontmatter = FrontmatterBase;

export type Article = ArticleFrontmatter & {
  kind: "article";
  slug: string;
  category: ArticleCategorySlug;
  href: string;
  readingTimeText: string;
  content: string;
};

export type Guide = GuideFrontmatter & {
  kind: "guide";
  slug: string;
  category: "guide";
  href: string;
  readingTimeText: string;
  content: string;
};

export type ContentItem = Article | Guide;

function readingTimeText(content: string): string {
  const minutes = Math.max(1, Math.ceil(readingTime(content).minutes));
  return `${minutes} min di lettura`;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

/**
 * Normalizza i campi che il resto del sito dà per scontati. Un articolo
 * pubblicato senza tag è normale (il campo è facoltativo nel pannello), ma
 * senza questa rete di sicurezza farebbe fallire l'intera build.
 */
function normalizeFrontmatter<T extends FrontmatterBase>(data: unknown): T {
  const frontmatter = (data ?? {}) as T;
  const { tags } = frontmatter;

  return {
    ...frontmatter,
    tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
  };
}

function loadArticle(
  category: ArticleCategorySlug,
  filename: string,
): Article {
  const slug = slugFromFilename(filename);
  const fullPath = path.join(ARTICLES_DIR, category, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    ...normalizeFrontmatter<ArticleFrontmatter>(data),
    kind: "article",
    slug,
    category,
    href: `/${category}/${slug}`,
    readingTimeText: readingTimeText(content),
    content,
  };
}

function loadGuide(filename: string): Guide {
  const slug = slugFromFilename(filename);
  const fullPath = path.join(GUIDES_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    ...normalizeFrontmatter<GuideFrontmatter>(data),
    kind: "guide",
    slug,
    category: "guide",
    href: `/guide/${slug}`,
    readingTimeText: readingTimeText(content),
    content,
  };
}

function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticlesByCategory(category: ArticleCategorySlug): Article[] {
  const dir = path.join(ARTICLES_DIR, category);
  const files = listMarkdownFiles(dir);
  return sortByDateDesc(files.map((file) => loadArticle(category, file)));
}

export function getAllArticles(): Article[] {
  const all = ARTICLE_CATEGORIES.flatMap((category) =>
    getArticlesByCategory(category),
  );
  return sortByDateDesc(all);
}

export function getArticleBySlug(
  category: ArticleCategorySlug,
  slug: string,
): Article | null {
  const filename = `${slug}.md`;
  const fullPath = path.join(ARTICLES_DIR, category, filename);
  if (!fs.existsSync(fullPath)) return null;
  return loadArticle(category, filename);
}

export function getAllGuides(): Guide[] {
  const files = listMarkdownFiles(GUIDES_DIR);
  return sortByDateDesc(files.map((file) => loadGuide(file)));
}

export function getGuideBySlug(slug: string): Guide | null {
  const filename = `${slug}.md`;
  const fullPath = path.join(GUIDES_DIR, filename);
  if (!fs.existsSync(fullPath)) return null;
  return loadGuide(filename);
}

export function getAllContent(): ContentItem[] {
  return sortByDateDesc([...getAllArticles(), ...getAllGuides()]);
}

/**
 * Contenuti di una sezione trasversale (MCU, DC Universe, Film, Serie TV):
 * pesca da tutte le categorie in base a `universe`/`format` del frontmatter.
 */
export function getContentBySection(section: SectionSlug): ContentItem[] {
  const { filter } = sections[section];

  return getAllContent().filter((item) => {
    if ("universe" in filter) return item.universe === filter.universe;
    if ("format" in filter) return item.format === filter.format;
    return false;
  });
}

/**
 * Ordina gli articoli in evidenza secondo `featuredOrder` (1 = primo).
 * Quelli senza numero vengono dopo, dal più recente.
 */
function sortByFeaturedOrder(items: Article[]): Article[] {
  const numbered = items
    .filter((a) => typeof a.featuredOrder === "number")
    .sort((a, b) => a.featuredOrder! - b.featuredOrder!);
  const rest = items.filter((a) => typeof a.featuredOrder !== "number");
  return [...numbered, ...rest];
}

export function getFeaturedArticles(limit = 4): Article[] {
  const featured = getAllArticles().filter((article) => article.featured);
  const pool = featured.length > 0 ? sortByFeaturedOrder(featured) : getAllArticles();
  return pool.slice(0, limit);
}

export function getFeaturedGuides(limit = 3): Guide[] {
  const featured = getAllGuides().filter((guide) => guide.featured);
  const pool = featured.length > 0 ? featured : getAllGuides();
  return pool.slice(0, limit);
}

export function getRelatedArticles(current: Article, limit = 3): Article[] {
  const others = getArticlesByCategory(current.category).filter(
    (article) => article.slug !== current.slug,
  );

  const byTagOverlap = others
    .map((article) => ({
      article,
      overlap: article.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .map(({ article }) => article);

  if (byTagOverlap.length >= limit) return byTagOverlap.slice(0, limit);

  const fallback = getAllArticles().filter(
    (article) =>
      article.slug !== current.slug &&
      !byTagOverlap.some((a) => a.slug === article.slug),
  );

  return [...byTagOverlap, ...fallback].slice(0, limit);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of getAllContent()) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getContentByTag(tag: string): ContentItem[] {
  return getAllContent().filter((item) => item.tags.includes(tag));
}

export function getAllTagSlugs(): string[] {
  return getAllTags().map(({ tag }) => tagToSlug(tag));
}

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function findTagBySlug(slug: string): string | null {
  const match = getAllTags().find(({ tag }) => tagToSlug(tag) === slug);
  return match?.tag ?? null;
}

export async function renderContent(item: ContentItem): Promise<string> {
  return markdownToHtml(item.content);
}
