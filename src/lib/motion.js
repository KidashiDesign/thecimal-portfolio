/* --------------------------------------------------------------------------
   BEWEGUNG REDUZIEREN — kleine Helfer
   --------------------------------------------------------------------------
   Wer in den Systemeinstellungen "Bewegung reduzieren" aktiviert hat,
   bekommt keine Pins, kein Scrubbing und keine langen Reveals — nur ruhige
   Einblendungen. Das ist ein Barrierefreiheits-Standard, kein Nice-to-have.
   -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Einmalige Abfrage — für Code außerhalb von React-Komponenten. */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Reaktive Variante für Komponenten: aktualisiert sich, wenn der Nutzer
 *  die Einstellung während des Besuchs umstellt. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
