import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chi Siamo",
  description: `Scopri chi c'è dietro ${siteConfig.name}, il magazine indipendente dedicato all'Universo Cinematografico Marvel.`,
  alternates: { canonical: "/chi-siamo" },
};

export default function ChiSiamoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Chi Siamo</h1>

      <div className="prose prose-marvel prose-invert mt-6 max-w-none">
        <p>
          <strong>{siteConfig.name}</strong> è un magazine indipendente nato
          dalla passione per il cinema di supereroi e, in particolare, per
          l&apos;Universo Cinematografico Marvel. Non siamo affiliati a Marvel
          Studios o Disney: raccontiamo l&apos;MCU da appassionati, con uno
          sguardo critico e senza filtri.
        </p>
        <p>
          Il nostro obiettivo è offrirti tre cose che spesso è difficile
          trovare insieme: notizie tempestive e verificate, analisi
          approfondite che vanno oltre il trailer del giorno, e guide di
          riferimento sempre aggiornate — come l&apos;ordine cronologico dei
          film o dove guardarli in streaming — a cui tornare ogni volta che ti
          serve un ripasso.
        </p>
        <h2>La redazione</h2>
        <p>
          Siamo un piccolo team di appassionati con esperienze diverse: chi
          segue l&apos;MCU sin dal primo Iron Man, chi arriva dal mondo dei
          fumetti, chi si occupa di analizzare trailer e materiali promozionali
          fotogramma per fotogramma. Ogni articolo passa da almeno una
          revisione prima della pubblicazione.
        </p>
        <h2>Trasparenza</h2>
        <p>
          Il sito si sostiene tramite pubblicità e, in alcuni articoli e
          guide, tramite link di affiliazione verso piattaforme di streaming o
          e-commerce: se acquisti tramite quei link potremmo ricevere una
          piccola commissione, senza alcun costo aggiuntivo per te. Questo non
          influenza mai i giudizi espressi nelle nostre recensioni.
        </p>
        <p>
          Hai suggerimenti, correzioni o vuoi collaborare con noi? Scrivici
          dalla pagina <Link href="/contatti">Contatti</Link>.
        </p>
      </div>
    </div>
  );
}
