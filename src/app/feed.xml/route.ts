import { getAllContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

/** Escape dei caratteri non ammessi nel testo XML. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Il feed dipende solo dai file in `content/`, quindi viene generato una volta
 * in fase di build invece che a ogni richiesta: più veloce da servire e
 * compatibile con l'export statico.
 */
export const dynamic = "force-static";

/**
 * Feed RSS 2.0, dichiarato nei metadata del layout. Serve ai lettori di feed
 * e ad aggregatori come Feedly, e alcuni servizi lo usano per scoprire i
 * contenuti nuovi più in fretta della sitemap.
 */
export async function GET() {
  const items = getAllContent().slice(0, 30);

  const body = items
    .map((item) => {
      const url = `${siteConfig.url}${item.href}`;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(item.excerpt)}</description>
      <category>${escapeXml(item.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>it-IT</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
${body}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
