/* --------------------------------------------------------------------------
   ASSET-PFADE
   --------------------------------------------------------------------------
   Warum es diese Datei gibt:

   Lokal läuft die Seite unter  http://localhost:5173/
   Auf GitHub Pages unter       https://kidashidesign.github.io/Thecimal/

   Ein Pfad wie "/images/mission-1.jpg" zeigt immer auf die Wurzel der Domain
   und würde auf GitHub Pages deshalb ins Leere laufen (die Datei liegt dort
   unter /Thecimal/images/mission-1.jpg).

   Diese kleine Funktion setzt den richtigen Anfang automatisch davor. Du
   kannst in src/content.js also ganz normal "/images/mission-1.jpg"
   schreiben und musst dich um nichts kümmern.

   Vollständige Adressen (https://…) und Data-URIs bleiben unverändert.
   -------------------------------------------------------------------------- */

// Wird von Vite gesetzt: "/" bei npm run dev, "/Thecimal/" beim Build
const BASE = import.meta.env.BASE_URL;

export function asset(path) {
  if (!path) return path;

  // Schon eine vollständige Adresse oder ein eingebettetes Bild? Nichts tun.
  if (/^[a-z]+:/i.test(path) || path.startsWith("//")) return path;

  // Pfad ab Wurzel: Basis davorsetzen
  if (path.startsWith("/")) return BASE.replace(/\/$/, "") + path;

  return path;
}
