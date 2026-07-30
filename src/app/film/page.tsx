import SectionPage, { sectionMetadata } from "@/components/SectionPage";

export const metadata = sectionMetadata("film");

export default function FilmPage() {
  return <SectionPage slug="film" />;
}
