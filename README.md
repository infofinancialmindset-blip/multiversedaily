# Multiverse Daily

Magazine indipendente su film e serie TV Marvel (MCU): news, teorie,
recensioni e guide evergreen. Costruito con Next.js (App Router, SSG),
contenuti in Markdown versionati su Git, editing no-code tramite Decap CMS.

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

## 2. Come aggiungere un nuovo articolo o guida

### Opzione A — modificando i file Markdown (nessun setup richiesto)

Ogni contenuto è un file `.md` con un blocco di frontmatter (i metadati) in
cima e il testo dell'articolo sotto, in Markdown.

| Categoria | Cartella |
|---|---|
| News | `content/articles/news/` |
| Teorie & Approfondimenti | `content/articles/teorie/` |
| Recensioni | `content/articles/recensioni/` |
| Guide (evergreen) | `content/guide/` |

Per creare un nuovo articolo, copia un file esistente nella cartella giusta,
rinominalo (il nome del file diventa l'URL, es. `il-mio-articolo.md` →
`/news/il-mio-articolo`) e aggiorna il frontmatter:

```md
---
title: "Titolo dell'articolo"
excerpt: "Un riassunto di una frase, usato nelle card e nei meta tag SEO."
tags: ["Tag Uno", "Tag Due"]
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

Per le **guide** aggiungi anche `updatedAt` (data di ultimo aggiornamento):
è il campo che viene mostrato in evidenza come "Aggiornata il..." e va
cambiato ogni volta che rivedi il contenuto.

Il sito legge tutti i file al momento della build: basta fare commit e push
(o pubblicare da Decap CMS) e Vercel ricostruisce automaticamente il sito.

### Opzione B — dal pannello editoriale `/admin` (consigliata se non usi Git)

Il sito include [Decap CMS](https://decapcms.org), un'interfaccia web che ti
permette di scrivere articoli da browser (editor visuale, upload immagini)
senza toccare Git: il salvataggio crea automaticamente un commit nel repo.

Per attivarlo dopo il primo deploy su Vercel:

1. Su GitHub, vai in **Settings → Developer settings → OAuth Apps → New
   OAuth App** e crea una nuova app con:
   - Homepage URL: `https://<il-tuo-dominio>`
   - Authorization callback URL: `https://<il-tuo-dominio>/api/callback`
2. Copia `Client ID` e genera un `Client secret`.
3. Su Vercel, apri il progetto → **Settings → Environment Variables** e
   aggiungi:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
4. Modifica `public/admin/config.yml`, campo `backend.repo`, inserendo il tuo
   `utente-github/nome-repo`.
5. Fai il deploy (o ridistribuisci) e visita `https://<il-tuo-dominio>/admin`.
   Accedi con il tuo account GitHub (deve avere accesso al repo) e potrai
   creare/modificare articoli e guide da un'interfaccia grafica.

> Nota: senza configurare le variabili d'ambiente sopra, `/admin` resta
> raggiungibile ma il login fallirà: fino ad allora usa l'Opzione A.

## 3. Struttura del progetto

```
content/
  articles/{news,teorie,recensioni}/*.md   articoli
  guide/*.md                                guide evergreen
src/
  app/            pagine (home, categorie, articolo, guida, tag, sitemap, robots)
  components/     componenti riutilizzabili (card, box "dove guardarlo", ecc.)
  lib/            lettura contenuti, formattazione, dati strutturati SEO
public/
  admin/          pannello Decap CMS
```

## 4. Monetizzazione (già predisposta, non attiva)

- **Pubblicità**: i punti di inserimento annunci (dopo il primo paragrafo,
  a metà articolo, fondo pagina, feed home) sono già presenti nel markup
  come placeholder vuoti (`src/components/ads/AdSlot.tsx`). Per attivare
  AdSense o Ezoic, sostituisci il contenuto di quel componente con lo script
  fornito dalla piattaforma pubblicitaria una volta approvato l'account.
- **Affiliazione**: il box "Dove guardarlo" (`WhereToWatchBox`) accetta link
  affiliati per piattaforme streaming o e-commerce tramite il campo
  frontmatter `whereToWatch` di ogni articolo/guida.
- **Newsletter**: il form in footer (`NewsletterForm`) è solo frontend;
  collega un provider (Mailchimp, Beehiiv, ConvertKit...) sostituendo la
  funzione `handleSubmit`.

## 5. Deploy

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
