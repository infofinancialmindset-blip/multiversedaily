"use client";

import { useEffect, useState } from "react";

/**
 * Barra di avanzamento della lettura, ancorata sotto l'header.
 * Usa requestAnimationFrame per non ricalcolare a ogni evento di scroll e
 * scompare del tutto per chi ha chiesto meno animazioni.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable <= 0 ? 0 : Math.min(1, window.scrollY / scrollable));
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[57px] z-30 h-0.5 bg-transparent motion-reduce:hidden"
      role="progressbar"
      aria-label="Avanzamento lettura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-accent-primary to-accent-leak transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
