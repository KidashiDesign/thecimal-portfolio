/* --------------------------------------------------------------------------
   WAVE SHRED — Konfiguration & Wellen-Mathematik
   --------------------------------------------------------------------------
   "Center Collapse & Wave Shred": Beim Scrollen zerreißt ein
   SVG-Verzerrungsfilter die ganze Seite, und alle markierten Elemente ziehen
   Richtung Bildschirmmitte, während sie in die Breite gehen. Steht die Seite
   still, ist alles wieder an seinem Platz.

   Der Ablauf ist der der Vorlage (index.html). Zwei Dinge sind bewusst
   anders, weil die Vorlage eine kurze Demo-Seite ist und das hier eine
   ausgewachsene Seite mit eigenen Scroll-Animationen:
   1. Die Stärke ist deutlich zurückgenommen (siehe unten).
   2. Ausgelöst wird über die Scroll-Geschwindigkeit statt über einzelne
      Scroll-Events (siehe Timing).

   Wer am Effekt dreht, dreht hier — die Mechanik steckt in
   src/components/WaveShred.jsx.
   -------------------------------------------------------------------------- */

export const WAVE_SHRED = {
  /* ---- Stärke des Effekts -------------------------------------------------
     Die drei Werte bestimmen zusammen, wie heftig es zugeht. Die Vorlage
     fährt sie voll aus (1500 / 10 / 1) — auf dieser Seite ist der Effekt
     damit so dominant, dass von den eigenen Scroll-Animationen der Seite
     (Parallax, Reveals, Meilensteine) nichts mehr zu sehen ist. Deshalb
     bewusst zurückgenommen: Es bleibt derselbe Effekt, nur eine Nummer
     kleiner. Höher drehen = näher an der Vorlage, aber die Seite
     verschwindet dahinter. */
  displacementScale: 70, // maximale Verschiebung in Pixeln (Vorlage: 1500)
  stretch: 1.25, // scaleX geht von 1 auf 1 + stretch (Vorlage: 10)
  maxCollapse: 0.3, // wie weit die Elemente Richtung Mitte fahren (Vorlage: 1)

  /* ---- Timing ------------------------------------------------------------
     Ausgelöst wird über die Scroll-GESCHWINDIGKEIT, nicht über einzelne
     Scroll-Events wie in der Vorlage. Grund: Diese Seite scrollt weich
     (Lenis). Nach dem Loslassen des Rads gleitet sie noch fast eine Sekunde
     aus und feuert dabei weiter Scroll-Events — an Events gekoppelt bliebe
     der Effekt die ganze Zeit hängen, obwohl der Nutzer längst aufgehört
     hat.

     Die Stärke hängt AN der Geschwindigkeit, nicht nur an "scrollt / scrollt
     nicht": langsam lesen = kaum Effekt, schnelles Durchziehen = voller
     Effekt. Damit klingt er beim Ausgleiten von selbst ab, statt bis zu einer
     Schwelle auf voller Stärke zu kleben — und wer in Ruhe liest, bekommt die
     Seite und ihre eigenen Scroll-Animationen ungestört zu sehen. */
  minSpeed: 0.08, // px pro ms — darunter gilt "steht still" (kein Flimmern)
  fullSpeed: 0.8, // px pro ms — ab hier volle Stärke

  /* attack/release sind Zeitkonstanten in Millisekunden, NICHT pro Bild:
     Die Vorlage rechnet pro Bild ("90 % der Reststrecke"), dadurch hängt die
     Dauer an der Bildrate — bricht sie ein, zieht sich das Zurückspringen
     spürbar in die Länge. Über die Zeit gerechnet dauert es immer gleich
     lang. */
  attack: 22, // ms — Hinweg, praktisch ein harter Schnitt
  release: 55, // ms — Rückweg

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
