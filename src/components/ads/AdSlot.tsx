type AdSlotId =
  | "article-after-first-paragraph"
  | "article-in-content"
  | "article-bottom"
  | "sidebar"
  | "home-feed";

const SLOT_LABELS: Record<AdSlotId, string> = {
  "article-after-first-paragraph": "Ad — dopo il primo paragrafo",
  "article-in-content": "Ad — tra i paragrafi",
  "article-bottom": "Ad — fondo articolo",
  sidebar: "Ad — sidebar",
  "home-feed": "Ad — feed home",
};

/**
 * Slot pubblicitario predisposto ma vuoto: sostituire il contenuto con lo
 * script AdSense/Ezoic quando l'account sarà approvato. Vedi README.
 */
export default function AdSlot({
  id,
  className = "",
}: {
  id: AdSlotId;
  className?: string;
}) {
  return (
    <div
      data-ad-slot={id}
      className={`flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-surface/40 py-6 text-xs uppercase tracking-wide text-muted/60 ${className}`}
      aria-hidden="true"
    >
      {SLOT_LABELS[id]}
    </div>
  );
}
