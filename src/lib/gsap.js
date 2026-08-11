/* --------------------------------------------------------------------------
   GSAP — zentrale Registrierung
   --------------------------------------------------------------------------
   ScrollTrigger darf nur EINMAL im ganzen Projekt registriert werden.
   Deshalb passiert das hier, und alle Komponenten importieren aus dieser
   Datei statt direkt aus "gsap".
   -------------------------------------------------------------------------- */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Standard-Werte für alle Animationen im Projekt.
// Hier drehst du an der "Grundstimmung" der Seite: langsamer/schneller,
// weicher/härter.
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

/* Media-Query-Bausteine für gsap.matchMedia().
   Damit schalten wir Pinning & Co. auf Mobile ab und respektieren
   die System-Einstellung "Bewegung reduzieren". */
export const MEDIA = {
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
  fullMotion: "(prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, useGSAP };
