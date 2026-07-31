"use client";

import { useRef, type ReactNode } from "react";

const MAX_TILT_DEG = 5;

/**
 * Leggera inclinazione 3D che segue il puntatore, per dare alle copertine un
 * effetto da poster. Volutamente contenuta:
 *  - si attiva solo dove esiste un vero hover (niente su touch);
 *  - si disattiva con "riduci animazioni" nelle preferenze di sistema;
 *  - aggiorna solo variabili CSS dentro requestAnimationFrame, senza
 *    rerender di React, così non pesa sullo scorrimento.
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!canTilt()) return;
    const el = ref.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-x", `${(-y * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
