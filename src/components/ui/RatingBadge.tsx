import { Star } from "lucide-react";

export default function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-recensioni/40 bg-accent-recensioni/10 px-3 py-1.5 text-sm font-semibold text-accent-recensioni">
      <Star className="h-4 w-4 fill-current" />
      {rating.toFixed(1)} / 10
    </div>
  );
}
