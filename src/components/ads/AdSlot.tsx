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
 * Gli spazi pubblicitari restano nel codice, nei punti giusti, ma non
 * vengono mostrati ai visitatori finché non attivi davvero AdSense/Ezoic:
 * un riquadro tratteggiato vuoto peggiora l'aspetto del sito e non porta
 * alcun guadagno.
 *
 * Per riattivarli imposta la variabile d'ambiente:
 *   NEXT_PUBLIC_ADS_ENABLED=true
 * (in locale nel file .env.local, in produzione fra le Environment
 * Variables di Vercel), poi sostituisci il segnaposto qui sotto con lo
 * script fornito dalla piattaforma pubblicitaria.
 */
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export default function AdSlot({
  id,
  className = "",
}: {
  id: AdSlotId;
  className?: string;
}) {
  if (!ADS_ENABLED) return null;

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
