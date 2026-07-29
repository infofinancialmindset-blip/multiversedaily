export const siteConfig = {
  name: "Multiverse Daily",
  tagline: "Notizie, teorie e guide sull'Universo Cinematografico Marvel",
  description:
    "Multiverse Daily è il magazine indipendente su film e serie TV Marvel (MCU): news quotidiane, teorie sui personaggi, recensioni e guide sempre aggiornate su dove guardare e in che ordine vedere l'MCU.",
  url: "https://www.multiversedaily.it",
  locale: "it_IT",
  twitterHandle: "@multiversedaily",
  founderEmail: "redazione@multiversedaily.it",
} as const;

export const categories = {
  news: {
    slug: "news",
    label: "News",
    description:
      "Le ultime notizie dal mondo Marvel: annunci, cast, trailer e aggiornamenti sulle produzioni in corso.",
    color: "var(--color-accent-news)",
  },
  teorie: {
    slug: "teorie",
    label: "Teorie & Approfondimenti",
    description:
      "Analisi, teorie e collegamenti tra i film: cosa ci aspetta nelle prossime fasi dell'MCU.",
    color: "var(--color-accent-teorie)",
  },
  recensioni: {
    slug: "recensioni",
    label: "Recensioni",
    description:
      "Recensioni oneste e senza spoiler (o con avviso spoiler) di film e serie TV Marvel.",
    color: "var(--color-accent-recensioni)",
  },
  guide: {
    slug: "guide",
    label: "Guide",
    description:
      "Guide evergreen: ordini cronologici, dove guardare in streaming, spiegazioni delle fasi MCU.",
    color: "var(--color-accent-guide)",
  },
} as const;

export type CategorySlug = keyof typeof categories;

export const navLinks = [
  { href: "/news", label: "News" },
  { href: "/teorie", label: "Teorie" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/guide", label: "Guide" },
  { href: "/chi-siamo", label: "Chi Siamo" },
] as const;
