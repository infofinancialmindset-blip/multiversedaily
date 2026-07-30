import Link from "next/link";
import {
  footerExtraLinks,
  navLinks,
  secondaryNavLinks,
  siteConfig,
} from "@/lib/site";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background-elevated">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-bold">{siteConfig.name}</p>
            <p className="mt-2 max-w-sm text-sm text-muted">{siteConfig.description}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Sezioni</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {[...navLinks, ...footerExtraLinks, ...secondaryNavLinks].map(
                (link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tutti i diritti riservati.
          </p>
          <p>
            Marvel, MCU, DC e i relativi loghi sono marchi registrati dei
            rispettivi proprietari. Questo sito è un progetto editoriale
            indipendente e non è affiliato a Marvel, DC, Disney o Warner Bros.
          </p>
        </div>
      </div>
    </footer>
  );
}
