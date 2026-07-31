export const siteConfig = {
  name: "Multiverse Daily",
  tagline: "Notizie, teorie e guide su MCU, DC e cinecomics",
  description:
    "Multiverse Daily è il magazine indipendente su film e serie TV di supereroi: news quotidiane, leak, teorie, recensioni e guide sempre aggiornate su Marvel (MCU), DC Universe e non solo.",
  url: "https://www.multiversedaily.it",
  locale: "it_IT",
  twitterHandle: "@multiversedaily",
  founderEmail: "redazione@multiversedaily.it",
} as const;

/**
 * Categorie = dove viene archiviato un articolo. Determinano la cartella in
 * `content/` e l'URL. Ogni articolo ne ha esattamente una.
 */
export const categories = {
  news: {
    slug: "news",
    label: "News",
    description:
      "Le ultime notizie dal mondo dei cinecomics: annunci, cast, trailer e aggiornamenti sulle produzioni in corso.",
    accent: "var(--accent-news)",
  },
  leak: {
    slug: "leak",
    label: "Leak",
    description:
      "Indiscrezioni, foto dal set e rumor non confermati. Contenuti da prendere con le pinze: indichiamo sempre quanto sono affidabili.",
    accent: "var(--accent-leak)",
  },
  teorie: {
    slug: "teorie",
    label: "Teorie & Approfondimenti",
    description:
      "Analisi, teorie e collegamenti tra i film: cosa ci aspetta nelle prossime fasi dell'MCU e non solo.",
    accent: "var(--accent-teorie)",
  },
  recensioni: {
    slug: "recensioni",
    label: "Recensioni",
    description:
      "Recensioni oneste e senza spoiler (o con avviso spoiler) di film e serie TV di supereroi.",
    accent: "var(--accent-recensioni)",
  },
  guide: {
    slug: "guide",
    label: "Guide",
    description:
      "Guide evergreen: ordini cronologici, dove guardare in streaming, spiegazioni delle fasi MCU.",
    accent: "var(--accent-guide)",
  },
} as const;

export type CategorySlug = keyof typeof categories;

/** Categorie con una cartella sotto `content/articles/`. Le guide stanno a parte. */
export const ARTICLE_CATEGORIES = [
  "news",
  "leak",
  "teorie",
  "recensioni",
] as const;

export type ArticleCategorySlug = (typeof ARTICLE_CATEGORIES)[number];

export function isArticleCategory(value: string): value is ArticleCategorySlug {
  return (ARTICLE_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Universo narrativo di appartenenza di un contenuto. Il colore è il segnale
 * visivo più forte sulle card: rosso = Marvel, blu = DC.
 * `section` punta alla pagina-raccolta corrispondente (null = nessuna).
 */
export const universes = {
  mcu: {
    slug: "mcu",
    label: "MCU",
    shortLabel: "Marvel",
    accent: "var(--accent-mcu)",
    section: "mcu",
  },
  dc: {
    slug: "dc",
    label: "DC Universe",
    shortLabel: "DC",
    accent: "var(--accent-dc)",
    section: "dc-universe",
  },
  altro: {
    slug: "altro",
    label: "Altri cinecomics",
    shortLabel: "Altro",
    accent: "var(--accent-altro)",
    section: null,
  },
} as const;

export type Universe = keyof typeof universes;

/** Formato del contenuto raccontato (film, serie TV, o nessuno dei due). */
export const formats = {
  film: { slug: "film", label: "Film" },
  serie: { slug: "serie", label: "Serie TV" },
  altro: { slug: "altro", label: "Altro" },
} as const;

export type ContentFormat = keyof typeof formats;

/**
 * Sezioni = pagine-raccolta trasversali. Non sono cartelle: aggregano
 * automaticamente articoli e guide di qualsiasi categoria in base
 * all'universo o al formato indicati nel frontmatter.
 */
export const sections = {
  mcu: {
    slug: "mcu",
    label: "MCU",
    title: "Marvel Cinematic Universe",
    description:
      "Tutto sull'Universo Cinematografico Marvel: news, leak, teorie, recensioni e guide su film e serie TV dell'MCU.",
    filter: { universe: "mcu" },
  },
  film: {
    slug: "film",
    label: "Film",
    title: "Film",
    description:
      "Tutti i contenuti dedicati ai film di supereroi: dagli annunci di produzione alle recensioni delle uscite in sala.",
    filter: { format: "film" },
  },
  "serie-tv": {
    slug: "serie-tv",
    label: "Serie TV",
    title: "Serie TV",
    description:
      "Serie TV e produzioni seriali tratte dai fumetti: novità, analisi e recensioni stagione per stagione.",
    filter: { format: "serie" },
  },
  "dc-universe": {
    slug: "dc-universe",
    label: "DC Universe",
    title: "DC Universe",
    description:
      "Il nuovo DC Universe e tutti i film e le serie targate DC: annunci, indiscrezioni, teorie e recensioni.",
    filter: { universe: "dc" },
  },
} as const;

export type SectionSlug = keyof typeof sections;

/** Barra di navigazione principale. */
export const navLinks = [
  { href: "/mcu", label: "MCU" },
  { href: "/film", label: "Film" },
  { href: "/serie-tv", label: "Serie TV" },
  { href: "/news", label: "News" },
  { href: "/dc-universe", label: "DC Universe" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/leak", label: "Leak" },
] as const;

/** Link secondari, mostrati in coda alla navbar e nel footer. */
export const secondaryNavLinks = [
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/contatti", label: "Contattaci" },
] as const;

/** Sezioni tematiche non in navbar, raggiungibili dal footer. */
export const footerExtraLinks = [
  { href: "/calendario", label: "Calendario uscite" },
  { href: "/teorie", label: "Teorie & Approfondimenti" },
  { href: "/guide", label: "Guide" },
] as const;
