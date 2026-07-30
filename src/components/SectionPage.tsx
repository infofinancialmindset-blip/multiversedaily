import type { Metadata } from "next";
import { getContentBySection } from "@/lib/content";
import { sections, type SectionSlug } from "@/lib/site";
import ContentGrid from "@/components/ContentGrid";
import AdSlot from "@/components/ads/AdSlot";

export function sectionMetadata(slug: SectionSlug): Metadata {
  const section = sections[slug];
  return {
    title: section.title,
    description: section.description,
    alternates: { canonical: `/${slug}` },
  };
}

/** Pagina-raccolta di una sezione trasversale (MCU, DC, Film, Serie TV). */
export default function SectionPage({ slug }: { slug: SectionSlug }) {
  const section = sections[slug];
  const items = getContentBySection(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-primary">
          Sezione
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          {section.title}
        </h1>
        <p className="mt-3 text-muted">{section.description}</p>
        <p className="mt-2 text-sm text-muted">
          {items.length}{" "}
          {items.length === 1 ? "contenuto pubblicato" : "contenuti pubblicati"}
        </p>
      </header>

      <ContentGrid items={items} />

      {items.length > 0 && <AdSlot id="home-feed" className="mt-12" />}
    </div>
  );
}
