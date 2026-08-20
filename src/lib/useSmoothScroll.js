/* --------------------------------------------------------------------------
   SMOOTH SCROLL (Lenis) — an GSAP ScrollTrigger gekoppelt
   --------------------------------------------------------------------------
   Lenis übernimmt das Scrollen der Seite (weiches "Ausrollen").
   Damit ScrollTrigger weiß, wo wir uns gerade befinden, rufen wir in Lenis'
   Animations-Loop `ScrollTrigger.update()` auf.

   Wenn die Systemeinstellung "Bewegung reduzieren" aktiv ist, wird Lenis
   gar nicht erst gestartet — dann scrollt der Browser ganz normal.
   -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./motion";

export function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 0.1, // "Nachlauf" des Scrollens in Sekunden
      smoothWheel: true,
      // Touch-Geräte scrollen bewusst nativ (Lenis-Standard): fühlt sich auf
      // dem Handy besser an und spart Akku. Wer das ändern will, setzt hier
      // syncTouch: true.
    });
    lenisRef.current = lenis;

    // Lenis meldet jede Scroll-Bewegung an ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    // Statt Lenis' eigenem requestAnimationFrame nutzen wir den Ticker von
    // GSAP. So laufen Scroll und Animationen im selben Frame — kein Ruckeln.
    const tick = (time) => lenis.raf(time * 1000); // GSAP liefert Sekunden
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
