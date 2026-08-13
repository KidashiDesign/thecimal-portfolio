/* --------------------------------------------------------------------------
   WAVE SHRED — Konfiguration & Wellen-Mathematik
   --------------------------------------------------------------------------
   "Center Collapse & Wave Shred": Sobald gescrollt wird, zerreißt ein
   SVG-Verzerrungsfilter den Seiteninhalt, die markierten Elemente werden zur
   Bildschirmmitte gezogen, flach gedrückt und legen sich auf die Wellenlinien
   im Hintergrund. Hört das Scrollen auf, springt alles zurück.

   Diese Datei enthält NUR Werte und reine Rechenfunktionen — die Mechanik
   steckt in src/components/WaveShred.jsx.

   Die Funktion waveY() ist die EINZIGE Quelle der Wahrheit für die Wellen:
   Der Hintergrund zeichnet damit seine Linien, und die Elemente berechnen
   damit ihren Zielpunkt. Nur so landen die Texte exakt auf einer Linie.
   -------------------------------------------------------------------------- */

/** Alle Regler an einem Ort — hier schraubst du am Gefühl der Animation. */
export const WAVE_SHRED = {
  /* ---- Shred (die Verzerrung) -------------------------------------------- */
  displacementScale: 1500, // Stärke des Zerreißens (0 = aus)
  stretch: 10, // wie stark Elemente in die Breite gezogen werden
  blur: 3, // Weichzeichnung in px auf dem Höhepunkt

  /* ---- Timing ------------------------------------------------------------ */
  snapSpeed: 0.9, // 0.9 = springt pro Frame 90 % Richtung Ziel (sehr hart)
  mergeSpeed: 0.42, // das Wandern auf die Welle hinkt bewusst hinterher
  stopDelay: 40, // ms ohne Scroll-Event, bis "Scrollen beendet" gilt

  /* ---- Wellen (Canvas-Hintergrund) --------------------------------------- */
  snapToWave: true, // false = Elemente sammeln sich stur in der Bildmitte
  lines: 9, // Anzahl der Linien — mehr wird beim Scrollen schnell zum Gekritzel
  color: "#cdff4f", // Akzentfarbe (= --accent)
  background: "#0a0a0b", // Seitenhintergrund (= --bg)
  opacity: 0.12, // Grundhelligkeit der Linien in Ruhe
  amplitude: 0.45, // Höhe der Wellenberge
  thickness: 1, // Linienstärke in px
  spread: 2.5, // vertikaler Abstand der Linien zueinander
  jitter: 0.16, // nervöses Zittern beim Scrollen
  flare: 0.28, // Aufleuchten der Linien beim Scrollen

  /* ---- Grenzen ------------------------------------------------------------
     Unter dieser Breite läuft nur der Wellen-Hintergrund, ohne Verzerrung:
     Der SVG-Filter ist auf Telefonen zu teuer. */
  minWidth: 768,

  /* Nur Elemente in Bildschirmnähe machen mit — gemessen in Bildschirmhöhen
     ober- und unterhalb des Sichtfensters. Ohne diese Grenze würde auch der
     Footer aus 8000 px Entfernung in die Bildmitte geflogen kommen: unnötige
     Rechenarbeit für einen Streifen, den niemand zuordnen kann. */
  cullViewports: 1.25,
};

/**
 * Y-Position einer Wellenlinie an der Stelle x.
 *
 * @param {number} x      Bildschirm-X in CSS-Pixeln
 * @param {number} line   Index der Linie (0 … lines-1)
 * @param {number} amp    zusätzlicher Amplituden-Faktor (Scroll-Energie)
 * @param {{height:number, time:number, cfg:object}} state
 */
export function waveY(x, line, amp, { height, time, cfg }) {
  const a = amp * cfg.amplitude;

  return (
    height / 2 +
    Math.sin(x * 0.01 + time + line) * 50 * a +
    Math.sin(x * 0.005 - time + line * 0.5) * 100 * a +
    Math.cos(x * 0.02 + time * 0.5) * 20 * a +
    // fächert die Linien vertikal auf, symmetrisch um die Mitte
    (line - (cfg.lines - 1) / 2) * 10 * cfg.spread
  );
}

/** Steigung der Welle an der Stelle x — daraus wird der Kippwinkel. */
export function waveSlope(x, line, amp, state) {
  return (waveY(x + 10, line, amp, state) - waveY(x - 10, line, amp, state)) / 20;
}

/** "#cdff4f" + 0.4  →  "rgba(205,255,79,0.4)" */
export function hexToRgba(hex, alpha) {
  const raw = (hex || "#ffffff").replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;
  const value = parseInt(full, 16);

  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}
