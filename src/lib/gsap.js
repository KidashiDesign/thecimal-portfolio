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

/* Pinning per transform statt per `position: fixed`.
   WaveShred legt einen CSS-Filter über den gesamten Seiteninhalt. Ein Filter
   erzeugt einen neuen Bezugsrahmen — `position: fixed` bezieht sich darin
   nicht mehr auf das Fenster, die gepinnte Meilenstein-Sektion würde also
   wegrutschen. Mit "transform" pinnt ScrollTrigger unabhängig davon. */
ScrollTrigger.defaults({ pinType: "transform" });

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
