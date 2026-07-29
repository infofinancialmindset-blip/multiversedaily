"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // TODO: collegare a un provider newsletter (Mailchimp/Beehiiv/ConvertKit).
    // Per ora il form è solo frontend: nessuna richiesta viene inviata.
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">Newsletter</p>
      <p className="mt-3 text-sm text-muted">
        Un riassunto settimanale delle news Marvel più importanti, senza spam.
      </p>

      {submitted ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-accent-guide/40 bg-accent-guide/10 px-3 py-2 text-sm text-accent-guide">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Grazie! Controlla la tua email per confermare l&apos;iscrizione.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
              className="w-full rounded-full border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-accent-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
          >
            Iscriviti
          </button>
        </form>
      )}
    </div>
  );
}
