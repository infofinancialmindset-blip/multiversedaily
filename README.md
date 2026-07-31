# Multiverse Daily

Magazine indipendente su cinecomics — Marvel (MCU), DC Universe e non solo:
news, leak, teorie, recensioni e guide evergreen. Costruito con Next.js
(App Router, SSG), contenuti in Markdown versionati su Git, editing no-code
tramite Decap CMS.

## Stack

- **Next.js 16 (App Router)** — pagine pre-renderizzate in build (SSG) per
  Core Web Vitals ottimi e SEO out-of-the-box.
- **Contenuti in Markdown** dentro `content/`, letti a build time con
  `gray-matter` + pipeline `remark`/`rehype`.
- **Tailwind CSS v4** per il tema scuro "cinecomics".
- **Decap CMS** (`/admin`) come pannello editoriale no-code, che scrive
  direttamente i file Markdown nel repository GitHub.

## 1. Avviare il progetto in locale

Requisiti: Node.js 20+ e npm.

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Le pagine si
ricaricano automaticamente quando modifichi codice o contenuti.

Per verificare la build di produzione (quella che gira su Vercel):

```bash
npm run build
npm run start
```

## 2. Come è organizzato il sito (importante)

Il sito ha due tipi di pagine di elenco, che funzionano diversamente:

**Categorie** — sono le cartelle dove archivi l'articolo e determinano il suo
URL. Ogni articolo ne ha **una sola**.

| Categoria | Cartella | URL |
|---|---|---|
| News | `content/articles/news/` | `/news` |
| Leak & Rumor | `content/articles/leak/` | `/leak` |
| Teorie & Approfondimenti | `content/articles/teorie/` | `/teorie` |
| Recensioni | `content/articles/recensioni/` | `/recensioni` |
| Guide (evergreen) | `content/guide/` | `/guide` |

**Sezioni** — non sono cartelle: raccolgono automaticamente contenuti da
*tutte* le categorie, in base a due campi del frontmatter. Uno stesso
articolo può quindi comparire in più sezioni contemporaneamente.

| Sezione | URL | Si popola con |
|---|---|---|
| MCU | `/mcu` | `universe: "mcu"` |
| DC Universe | `/dc-universe` | `universe: "dc"` |
| Film | `/film` | `format: "film"` |
| Serie TV | `/serie-tv` | `format: "serie"` |

Esempio: la recensione di un film Marvel con `universe: "mcu"` e
`format: "film"` appare sotto **Recensioni**, **MCU** e **Film** — l'articolo
lo scrivi una volta sola.

## 3. Come aggiungere un nuovo articolo o guida

### Opzione A — modificando i file Markdown (nessun setup richiesto)

Ogni contenuto è un file `.md` con un blocco di frontmatter (i metadati) in
cima e il testo dell'articolo sotto, in Markdown.

Per creare un nuovo articolo, copia un file esistente nella cartella giusta,
rinominalo (il nome del file diventa l'URL, es. `il-mio-articolo.md` →
`/news/il-mio-articolo`) e aggiorna il frontmatter:

```md
---
title: "Titolo dell'articolo"
excerpt: "Un riassunto di una frase, usato nelle card e nei meta tag SEO."
tags: ["Tag Uno", "Tag Due"]
universe: "mcu"         # mcu | dc | altro  → sezioni MCU / DC Universe
format: "film"          # film | serie | altro → sezioni Film / Serie TV
publishedAt: "2026-07-29"
author: "Il tuo nome"
featured: false        # true per comparire in home
coverImage: "/images/copertina.jpg"   # opzionale: senza, viene usato un placeholder grafico
rating: 8.5             # solo per le recensioni, da 1 a 10
whereToWatch:           # opzionale: box "Dove guardarlo" con link affiliati
  - platform: "Disney+"
    url: "https://www.disneyplus.com"
    note: "Streaming incluso"
---

Il testo dell'articolo in Markdown, con **grassetto**, [link](/guide/...),
elenchi, titoli `##`, ecc.
```

Se ometti `universe` o `format`, l'articolo resta pubblicato e visibile nella
sua categoria, ma non comparirà nelle sezioni corrispondenti.

Per le **guide** aggiungi anche `updatedAt` (data di ultimo aggiornamento):
è il campo che viene mostrato in evidenza come "Aggiornata il..." e va
cambiato ogni volta che rivedi il contenuto.

Il sito legge tutti i file al momento della build: basta fare commit e push
(o pubblicare da Decap CMS) e Vercel ricostruisce automaticamente il sito.

### Opzione B — dal pannello `/admin` in locale (già funzionante)

Il sito include [Decap CMS](https://decapcms.org): editor visuale con
formattazione, upload immagini, menu a tendina per universo e formato, e
anteprima live. In locale funziona **senza nessuna configurazione**.

Servono due terminali:

```bash
npm run cms
```

```bash
npm run dev
```

Poi apri [http://localhost:3000/admin](http://localhost:3000/admin). Non
serve login: `npm run cms` avvia un proxy che salva direttamente nei file del
progetto. Quando premi **Publish**, il file `.md` viene creato in `content/`.
Ti resta solo da fare commit e push per pubblicarlo online.

### Opzione C — dal pannello `/admin` online (senza toccare il computer)

In produzione lo stesso pannello scrive su GitHub, così puoi pubblicare da
qualsiasi browser (anche da telefono). Va attivato una volta sola, dopo il
primo deploy:

1. Su GitHub, vai in **Settings → Developer settings → OAuth Apps → New
   OAuth App** e crea una nuova app con:
   - Homepage URL: `https://<il-tuo-dominio>`
   - Authorization callback URL: `https://<il-tuo-dominio>/api/callback`
2. Copia `Client ID` e genera un `Client secret`.
3. Su Vercel, apri il progetto → **Settings → Environment Variables** e
   aggiungi:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
4. Ridistribuisci e visita `https://<il-tuo-dominio>/admin`, poi accedi con
   GitHub. Ogni salvataggio diventa un commit e Vercel ricostruisce il sito.

> Il repository è già configurato in `public/admin/config.yml`
> (`infofinancialmindset-blip/multiversedaily`). Finché non imposti le due
> variabili d'ambiente, il login online non funziona: nel frattempo usa
> l'Opzione B, che è completa.

## 4. Struttura del progetto

```
content/
  articles/{news,leak,teorie,recensioni}/*.md   articoli
  guide/*.md                                     guide evergreen
src/
  app/            pagine (home, sezioni, categorie, articolo, guida, tag,
                  sitemap, robots)
  components/     componenti riutilizzabili (card, box "dove guardarlo", ecc.)
  lib/            lettura contenuti, formattazione, dati strutturati SEO
                  site.ts = navbar, categorie e sezioni (modifica qui il menu)
public/
  admin/          pannello Decap CMS
```

## 5. Monetizzazione (già predisposta, non attiva)

- **Pubblicità**: i punti di inserimento annunci (dopo il primo paragrafo,
  a metà articolo, fondo pagina, feed home) sono già nel codice ma **non
  vengono mostrati ai visitatori**: `AdSlot` non renderizza nulla finché non
  imposti la variabile d'ambiente `NEXT_PUBLIC_ADS_ENABLED=true`. Quando
  AdSense o Ezoic ti approvano, imposta quella variabile e sostituisci il
  segnaposto in `src/components/ads/AdSlot.tsx` con il loro script.
- **Affiliazione**: il box "Dove guardarlo" (`WhereToWatchBox`) accetta link
  affiliati per piattaforme streaming o e-commerce tramite il campo
  frontmatter `whereToWatch` di ogni articolo/guida.
- **Newsletter**: il form in footer (`NewsletterForm`) è solo frontend;
  collega un provider (Mailchimp, Beehiiv, ConvertKit...) sostituendo la
  funzione `handleSubmit`.

## 5b. Statistiche e performance

Il sito invia i dati a **Vercel Analytics** (visite, pagine più lette,
provenienza) e **Speed Insights** (Core Web Vitals reali degli utenti).
Nessuno dei due usa cookie, quindi non richiedono il banner di consenso.

Dove si leggono:

| Cosa | Dove |
|---|---|
| Visite, pagine più lette, provenienza | Vercel → progetto → scheda **Analytics** |
| Velocità e Core Web Vitals | Vercel → progetto → scheda **Speed Insights** |
| Posizionamento su Google, query di ricerca | [Search Console](https://search.google.com/search-console) (da registrare) |

> Il piano gratuito di Vercel Analytics ha un limite mensile di eventi:
> abbondante per un sito che parte, da rivedere quando il traffico cresce.

## 6. Deploy

Consigliato: **Vercel**, per l'integrazione nativa con Next.js (build
automatiche, immagini ottimizzate, deploy preview per ogni modifica).

1. Pusha il repository su GitHub.
2. Su [vercel.com](https://vercel.com), importa il repository.
3. Imposta le eventuali environment variables (`GITHUB_OAUTH_CLIENT_ID`,
   `GITHUB_OAUTH_CLIENT_SECRET` per Decap CMS, vedi sopra).
4. Aggiorna `url` in `src/lib/site.ts` con il dominio reale del sito, così
   sitemap e meta tag Open Graph puntano all'URL corretto.
5. Deploy: ogni push su `main` aggiorna automaticamente il sito in
   produzione; ogni Pull Request genera un URL di anteprima.

In alternativa Netlify funziona altrettanto bene con Next.js e ha un
supporto nativo per Decap CMS (Git Gateway) che evita di configurare
manualmente l'OAuth App GitHub — utile se preferisci semplicità a Vercel in
questo aspetto specifico.
