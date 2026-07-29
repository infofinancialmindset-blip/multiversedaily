import AdSlot from "@/components/ads/AdSlot";

const CLOSE_P = "</p>";

function splitAt(html: string, index: number): [string, string] {
  return [html.slice(0, index), html.slice(index)];
}

function splitAfterFirstParagraph(html: string): [string, string] {
  const idx = html.indexOf(CLOSE_P);
  if (idx === -1) return [html, ""];
  return splitAt(html, idx + CLOSE_P.length);
}

function splitNearMiddle(html: string): [string, string] {
  const indices: number[] = [];
  let i = html.indexOf(CLOSE_P);
  while (i !== -1) {
    indices.push(i);
    i = html.indexOf(CLOSE_P, i + 1);
  }
  if (indices.length === 0) return [html, ""];

  const mid = html.length / 2;
  const closest = indices.reduce((best, idx) =>
    Math.abs(idx - mid) < Math.abs(best - mid) ? idx : best,
  );
  return splitAt(html, closest + CLOSE_P.length);
}

/**
 * Renderizza l'HTML dell'articolo inserendo slot pubblicitari vuoti dopo il
 * primo paragrafo e a metà contenuto, così sono già predisposti quando
 * attiverai AdSense/Ezoic (vedi README).
 */
export default function ArticleBody({ html }: { html: string }) {
  const [firstParagraph, rest] = splitAfterFirstParagraph(html);
  const [middle, end] = splitNearMiddle(rest);

  return (
    <div className="prose prose-marvel prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: firstParagraph }} />
      {rest && <AdSlot id="article-after-first-paragraph" className="not-prose my-6" />}
      <div dangerouslySetInnerHTML={{ __html: middle }} />
      {end && <AdSlot id="article-in-content" className="not-prose my-6" />}
      <div dangerouslySetInnerHTML={{ __html: end }} />
    </div>
  );
}
