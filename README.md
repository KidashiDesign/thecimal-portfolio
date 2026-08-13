# Thecimal — Creative-Agency-Landingpage

Einseitige React-Anwendung mit scroll-gesteuerten Animationen (GSAP + ScrollTrigger,
Smooth Scrolling über Lenis). Alle Texte und Bilder sind Platzhalter und liegen
zentral in **einer einzigen Datei**.

---

## Loslegen

```bash
npm install     # einmalig
npm run dev     # Entwicklungsserver, Adresse steht danach im Terminal
```

Weitere Befehle:

| Befehl            | Was es tut                                              |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Lokaler Server mit Live-Reload beim Speichern           |
| `npm run build`   | Fertige Seite bauen (landet im Ordner `dist/`)          |
| `npm run preview` | Die gebaute Seite lokal ansehen, so wie sie live wäre   |

---

## Live-Seite

**https://kidashidesign.github.io/Thecimal/**

Diese Adresse ist öffentlich — du kannst sie an jeden weitergeben.

### ⚠️ Einmalig nötig: Pages einschalten

Die Adresse funktioniert erst, wenn GitHub Pages einmal aktiviert wurde.
Das geht **nur im Browser** — weder ich noch der Workflow dürfen diese
Einstellung setzen (GitHub erlaubt das automatischen Zugriffen nicht).

1. Repository öffnen → Reiter **Settings**
2. Links im Menü → **Pages**
3. Unter „Build and deployment" bei **Source** → **GitHub Actions** wählen
4. Reiter **Actions** → letzten Lauf „Deploy to GitHub Pages" öffnen →
   **Re-run all jobs**

Danach ist die Seite nach ein bis zwei Minuten online.

Ab dann läuft alles von allein: bei **jedem Push auf `main`** wird die Seite
automatisch neu gebaut und veröffentlicht. Den Fortschritt siehst du jeweils
im Reiter **Actions**.

---

## 👉 Wo tausche ich Texte und Bilder aus?

**In `src/content.js` — und sonst nirgends.**

Diese Datei enthält alle Überschriften, Absätze, Links und Bildpfade, nach
Sektionen sortiert und kommentiert. Die Komponenten holen sich alles von dort;
in keiner Komponente steht ein fest verdrahteter Text.

### Text ändern

Den Text zwischen den Anführungszeichen überschreiben:

```js
export const hero = {
  headlineTop: "ZA",        // ← hier
  headlineBottom: "NO",     // ← und hier
  founderName: "Platzhalter Name",
};
```

Struktur bitte stehen lassen (Feldnamen, Kommas, Klammern). Listen in eckigen
Klammern `[ ... ]` darfst du verlängern oder kürzen — z. B. ein viertes Projekt
ergänzen: einfach das letzte Objekt kopieren und anpassen.

### Bild ändern

Alle Bilder sind aktuell Platzhalter von picsum.photos nach diesem Muster:

```
https://picsum.photos/seed/mission-1/600/800
                          ↑ Name    ↑ Breite/Höhe
```

Der Name (`mission-1`, `project-a-hero`, `cta-3` …) sagt dir, an welcher Stelle
der Seite das Bild sitzt. So ersetzt du es:

1. Eigenes Bild in den Ordner `public/images/` legen, z. B. `public/images/mission-1.jpg`
   (den Ordner ggf. anlegen)
2. In `src/content.js` die URL ersetzen durch `"/images/mission-1.jpg"`
   — der Schrägstrich am Anfang ist wichtig

Behalte möglichst das Seitenverhältnis des Platzhalters bei (die zwei Zahlen am
Ende der URL sind Breite und Höhe), sonst verschiebt sich das Layout.

> Der führende Schrägstrich funktioniert lokal **und** auf der Live-Seite:
> `src/lib/asset.js` setzt automatisch den richtigen Anfang davor. Du musst
> dich also nicht um den Unterordner `/Thecimal/` kümmern.

### Logo ändern

`public/placeholder/logo.svg` durch dein eigenes SVG ersetzen — gleicher
Dateiname, ähnliches Seitenverhältnis (ca. 120 × 32). Das Logo erscheint dann
automatisch in Kopfzeile und Footer.

⚠️ **Die Farbe muss im SVG selbst stehen.** Das Logo wird als Bild eingebunden
und erbt deshalb keine Farbe von der Seite. Ein SVG mit `fill="currentColor"`
wird schwarz dargestellt und ist auf dem dunklen Hintergrund unsichtbar — im
Platzhalter steht daher fest `fill="#f4f1ea"`. Nimm für dein Logo eine helle
Variante (oder eine dunkle, falls du den Hintergrund auf hell umstellst).

### Hero-Video ändern

Aktuell ist **kein** Video hinterlegt. Solange keins da ist, zeigt der Hero
automatisch das Standbild aus `hero.posterImage` — die Seite sieht also nicht
kaputt aus.

Eigenes Video: MP4 nach `public/placeholder/hero-loop.mp4` legen (oder den Pfad
in `content.js` unter `hero.backgroundVideo` anpassen). Es läuft stumm in
Endlosschleife. Empfehlung: unter 5 MB, sonst dauert das Laden zu lange.

### Farben und Schrift ändern

In `src/styles/global.css` ganz oben im Block `:root`:

```css
--bg:     #0a0a0b;   /* Seitenhintergrund */
--ink:    #f4f1ea;   /* Textfarbe */
--accent: #cdff4f;   /* Akzentfarbe: Buttons, aktive Tabs, Highlights */
```

Darunter stehen Schriftarten (`--font-display`, `--font-body`), Abstände und
Schriftgrößen. Eine Änderung dort wirkt auf der ganzen Seite.

---

## Aufbau der Dateien

```
src/
├── content.js              ← ALLE Texte und Bildpfade
├── App.jsx                 ← Reihenfolge der Sektionen
├── main.jsx                ← Einstiegspunkt (selten anzufassen)
│
├── components/             ← eine Datei pro Sektion
│   ├── Nav.jsx             1. Kopfzeile + Vollbild-Menü
│   ├── Hero.jsx            2. Hero mit Video und Riesen-Headline
│   ├── Statement.jsx       3. Text, der Wort für Wort aufhellt
│   ├── MissionVision.jsx   4. Vision/Mission-Tabs + Bild-Cluster
│   ├── Milestones.jsx      5. Horizontales Scrollen + Zahlen-Counter
│   ├── Projects.jsx        6. Projekt-Tabs mit Crossfade
│   ├── Marquee.jsx         7. Endlos-Laufschrift
│   ├── Testimonials.jsx    8. Zitate mit Avatar-Stack
│   ├── CallToAction.jsx    9. "Sag Hallo" + Bild-Grid
│   ├── Footer.jsx         10. Footer
│   ├── WaveShred.jsx       Wellen-Hintergrund + Scroll-Verzerrung
│   ├── Odometer.jsx        Hilfsteil: rollende Ziffern
│   └── Split.jsx           Hilfsteil: Text in Buchstaben/Wörter zerlegen
│
├── styles/                 ← ein CSS pro Sektion, gleiche Namen
│   ├── global.css          Farben, Schrift, Abstände (hier anfangen)
│   └── …
│
└── lib/
    ├── gsap.js             GSAP-Grundeinstellungen
    ├── useSmoothScroll.js  Smooth Scrolling (Lenis)
    ├── waveShred.js        Regler + Wellen-Formel für WaveShred
    └── motion.js           Erkennung von "Bewegung reduzieren"
```

Sektion umsortieren oder weglassen: in `src/App.jsx` die entsprechende Zeile
verschieben bzw. auskommentieren.

---

## Was die Animationen tun

| Sektion      | Effekt                                                                   |
| ------------ | ------------------------------------------------------------------------ |
| Hero         | Headline fliegt buchstabenweise ein, Hintergrund mit Parallax             |
| Statement    | Wörter hellen sich beim Scrollen einzeln auf (`scrub` – hängt am Scrollrad) |
| Mission      | Bild-Cluster mit drei unterschiedlichen Scroll-Geschwindigkeiten          |
| Meilensteine | Sektion wird fixiert, Panels laufen seitlich durch, Zahlen rollen hoch    |
| Projekte     | Crossfade zwischen Bildern und Meta-Infos beim Tab-Wechsel                |
| Marquee      | Endlos-Laufschrift, wird beim Drüberfahren langsamer                      |
| CTA          | Bild-Grid erscheint gestaffelt, Hover zoomt leicht                        |

### Wave Shred — der Effekt über der ganzen Seite

Beim Scrollen zerreißt ein SVG-Verzerrungsfilter den gesamten Inhalt, und alle
markierten Blöcke ziehen Richtung Bildschirmmitte, während sie in die Breite
gehen. Steht die Seite still, ist alles wieder an seinem Platz.

- **Stärke hängt am Tempo:** In Ruhe lesen und langsam scrollen zeigt kaum
  Effekt, zügiges Scrollen die volle Stärke. Gesteuert über `minSpeed` (ab
  wann überhaupt etwas passiert) und `fullSpeed` (ab wann volle Stärke) in
  Pixeln pro Millisekunde.

  Die Vorlage schaltet stattdessen bei jedem Scroll-Event hart auf 100 % und
  nach 40 ms ohne Event wieder aus. Das passt hier nicht: Diese Seite scrollt
  weich (Lenis) und gleitet nach dem Loslassen noch fast eine Sekunde aus —
  an Events gekoppelt bliebe der Effekt die ganze Zeit auf voller Stärke
  kleben. Am Tempo gekoppelt klingt er mit dem Ausgleiten ab.

- **Zurückspringen:** `attack` und `release` sind Zeitkonstanten in
  Millisekunden, nicht Schritte pro Bild wie in der Vorlage. Dadurch dauert es
  immer gleich lang, auch wenn die Bildrate einbricht.

- **Stärke:** `displacementScale`, `stretch` und `maxCollapse`. Alle drei sind
  gegenüber der Vorlage (1500 / 10 / 1) deutlich zurückgenommen, sonst deckt
  der Effekt die eigenen Scroll-Animationen der Seite komplett zu. Höher
  drehen = näher an der Vorlage, aber die Seite verschwindet dahinter.

- **Regler:** alle Werte in `src/lib/waveShred.js`.
- **Wer macht mit:** jedes Element mit dem Attribut `data-warp`. Zwei Regeln:
  nicht auf etwas setzen, das GSAP schon per `transform` bewegt (beide würden
  in dieselbe Eigenschaft schreiben), und nicht auf `position: fixed`-Elemente
  (deshalb liegt die Navigation außerhalb).
- **`data-warp-frame`:** markiert Container, die GSAP selbst verschiebt
  (Hero-Parallax, gepinnte Meilensteine samt Track). Elemente darin messen
  ihre Position relativ zu diesem Rahmen statt zum Dokument — sonst zielen
  sie am Bildschirmmittelpunkt vorbei.
- **Grenzen:** Unter 768 px Breite und bei „Bewegung reduzieren“ läuft nur der
  ruhige Wellen-Hintergrund.
- **Leistung:** Der Filter liegt über der ganzen Seite — so steht es in der
  Vorlage, und nur so zerreißt die Seite als Ganzes statt jedes Element für
  sich. Das ist der teuerste Teil des Effekts. Wird es auf schwächeren Geräten
  zäh, sind die wirksamsten Stellschrauben: weniger `data-warp`-Elemente,
  kleinerer `displacementScale`, kleinerer `stretch`.

**Barrierefreiheit:** Ist im Betriebssystem „Bewegung reduzieren“ aktiviert,
werden alle aufwendigen Effekte abgeschaltet — kein Fixieren, kein seitliches
Scrollen, nur ruhige Einblendungen. Der Inhalt bleibt vollständig lesbar.

**Mobil:** Unter 768 px Bildschirmbreite gibt es kein Fixieren und kein
horizontales Scrollen; die Meilenstein-Panels stehen dann untereinander.

---

## Technik

- Vite + React 19
- GSAP mit ScrollTrigger, eingebunden über den `useGSAP`-Hook (räumt beim
  Verlassen einer Sektion automatisch auf)
- Lenis für weiches Scrollen, gekoppelt an GSAPs Ticker
- Reines CSS, eine Datei pro Sektion, keine CSS-Frameworks
