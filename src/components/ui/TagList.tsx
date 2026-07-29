import Link from "next/link";
import { tagToSlug } from "@/lib/content";

export default function TagList({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tag/${tagToSlug(tag)}`}
            className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-accent-primary hover:text-foreground"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
