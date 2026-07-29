import type { Metadata } from "next";
import { categories } from "@/lib/site";
import { getAllGuides } from "@/lib/content";
import GuideCard from "@/components/GuideCard";

export const metadata: Metadata = {
  title: categories.guide.label,
  description: categories.guide.description,
  alternates: { canonical: "/guide" },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {categories.guide.label}
        </h1>
        <p className="mt-3 text-muted">{categories.guide.description}</p>
      </header>

      <div className="mt-8 grid gap-5">
        {guides.map((guide) => (
          <GuideCard key={guide.href} guide={guide} />
        ))}
      </div>
    </div>
  );
}
