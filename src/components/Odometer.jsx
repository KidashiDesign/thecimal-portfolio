/* --------------------------------------------------------------------------
   ODOMETER — Ziffern rollen hoch wie ein Kilometerzähler
   --------------------------------------------------------------------------
   So funktioniert der Trick:
   Jede Ziffer ist eine schmale "Walze" (reel) mit overflow:hidden — ein
   Fenster, das genau eine Ziffernhöhe hoch ist. Darin steckt eine lange
   Spalte (stack) mit den Ziffern 0–9, dreimal hintereinander.

   Wird die Spalte nach oben geschoben, rauschen die Ziffern durchs Fenster
   und bleiben auf der Zielziffer stehen. Weil 0–9 dreimal vorkommt, dreht
   sich die Walze zweimal komplett durch, bevor sie einrastet.
   -------------------------------------------------------------------------- */

import { gsap } from "../lib/gsap";
import "../styles/odometer.css";

const REPEATS = 3; // wie oft 0–9 in der Spalte wiederholt wird
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TOTAL = REPEATS * DIGITS.length; // Gesamtzahl der Ziffern pro Spalte

export default function Odometer({ value, suffix = "" }) {
  const digits = String(value).split("");

  return (
    // aria-label: Screenreader lesen die fertige Zahl, nicht die Walzen.
    <span className="odometer" aria-label={`${value}${suffix}`} role="text">
      {digits.map((digit, index) => (
        <span className="odometer__reel" aria-hidden="true" key={index}>
          <span className="odometer__stack" data-digit={digit}>
            {Array.from({ length: REPEATS }).map((_, repeat) =>
              DIGITS.map((n) => (
                <span className="odometer__digit" key={`${repeat}-${n}`}>
                  {n}
                </span>
              ))
            )}
          </span>
        </span>
      ))}

      {suffix ? (
        <span className="odometer__suffix" aria-hidden="true">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Startet den Roll-Vorgang für alle Odometer innerhalb von `container`.
 *
 * @param {HTMLElement} container – Element, in dem gesucht wird (z. B. ein Panel)
 * @param {boolean}     instant   – true = ohne Animation direkt auf den Endwert
 *                                  (wird bei "Bewegung reduzieren" genutzt)
 */
export function rollOdometer(container, instant = false) {
  const stacks = container.querySelectorAll(".odometer__stack");
  if (!stacks.length) return;

  gsap.to(stacks, {
    // Zielposition: die letzte Wiederholung, dort die passende Ziffer.
    yPercent: (index, element) => {
      const digit = Number(element.dataset.digit);
      const targetIndex = TOTAL - DIGITS.length + digit; // z. B. 20 + 7
      return -(100 / TOTAL) * targetIndex;
    },
    duration: instant ? 0 : 1.8,
    ease: "power4.out",
    // Ziffern rasten von links nach rechts nacheinander ein.
    stagger: instant ? 0 : 0.12,
    overwrite: true,
  });
}
