/* --------------------------------------------------------------------------
   WAVE SHRED — Konfiguration & Wellen-Mathematik
   --------------------------------------------------------------------------
   "Center Collapse & Wave Shred": Sobald gescrollt wird, zerreißt ein
   SVG-Verzerrungsfilter die ganze Seite, und alle markierten Elemente werden
   in die exakte Bildschirmmitte gezogen und dabei in die Breite gestreckt.
   Hört das Scrollen auf, springt alles zurück.

   Die Werte stammen 1:1 aus der Vorlage (index.html). Wer am Effekt dreht,
   dreht hier — die Mechanik steckt in src/components/WaveShred.jsx.
   -------------------------------------------------------------------------- */

export const WAVE_SHRED = {
  /* ---- Shred (die Verzerrung) --------------------------------------------
     displacementScale ist die maximale Verschiebung in Pixeln. */
  displacementScale: 1500,
  stretch: 10, // scaleX geht von 1 auf 1 + stretch

  /* ---- Timing ------------------------------------------------------------
     Binärer Auslöser: Das erste Scroll-Event schaltet auf 100 %, 40 ms ohne
     weiteres Event schalten wieder auf 0. Dazwischen wird pro Bild 90 % der
     Reststrecke zurückgelegt — deshalb wirkt es wie ein harter Schnitt. */
  snapSpeed: 0.9,
  stopDelay: 40, // ms

  /* ---- Wellen (Canvas-Hintergrund) --------------------------------------- */
  lines: 15,
  color: "#cdff4f", // Akzentfarbe der Seite (= --accent)
  background: "#0a0a0b", // Seitenhintergrund (= --bg)
  opacity: 0.15,

  /* ---- Grenzen ------------------------------------------------------------
     Unter dieser Breite und bei "Bewegung reduzieren" läuft nur der
     Wellen-Hintergrund: Der Filter ist auf Telefonen zu teuer, und eine
     zerreißende Seite ist genau das, was "Bewegung reduzieren" abbestellt. */
  minWidth: 768,
};

/**
 * Y-Position einer Wellenlinie an der Stelle x — exakt die Formel aus der
 * Vorlage. Der Hintergrund ist die einzige Stelle, die sie braucht.
 */
export function waveY(x, line, height, time) {
  return (
    height / 2 +
    Math.sin(x * 0.01 + time + line) * 50 +
    Math.sin(x * 0.005 - time + line * 0.5) * 100 +
    Math.cos(x * 0.02 + time * 0.5) * 20
  );
}

/** "#cdff4f" + 0.15  →  "rgba(205,255,79,0.15)" */
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
