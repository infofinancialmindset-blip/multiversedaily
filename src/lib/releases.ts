import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentFormat, Universe } from "./site";

const RELEASES_DIR = path.join(process.cwd(), "content", "uscite");

export type Release = {
  slug: string;
  title: string;
  /** Data di uscita in formato YYYY-MM-DD. */
  releaseDate: string;
  universe?: Universe;
  format?: ContentFormat;
  coverImage?: string;
  /** Es. "Al cinema", "Su Disney+", "Data non confermata". */
  note?: string;
  /** Articolo collegato, per approfondire. */
  link?: string;
  description?: string;
};

function loadRelease(filename: string): Release {
  const raw = fs.readFileSync(path.join(RELEASES_DIR, filename), "utf8");
  const { data } = matter(raw);
  return {
    ...(data as Omit<Release, "slug">),
    slug: filename.replace(/\.md$/, ""),
  };
}

export function getAllReleases(): Release[] {
  if (!fs.existsSync(RELEASES_DIR)) return [];
  return fs
    .readdirSync(RELEASES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(loadRelease)
    .sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
    );
}

/**
 * Uscite non ancora avvenute. Il confronto usa la mezzanotte di oggi così una
 * data odierna resta "in arrivo" per tutta la giornata.
 */
export function getUpcomingReleases(limit?: number): Release[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = getAllReleases().filter(
    (r) => new Date(r.releaseDate).getTime() >= today.getTime(),
  );

  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function getPastReleases(): Release[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getAllReleases()
    .filter((r) => new Date(r.releaseDate).getTime() < today.getTime())
    .reverse();
}
