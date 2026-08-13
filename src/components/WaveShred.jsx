/* --------------------------------------------------------------------------
   WAVE SHRED — "Center Collapse & Wave Shred"
   --------------------------------------------------------------------------
   Diese Komponente macht drei Dinge gleichzeitig:

   1. CANVAS   — zeichnet die animierten Wellenlinien hinter der Seite.
   2. FILTER   — legt einen SVG-Verzerrungsfilter auf die bewegten Elemente,
                 der beim Scrollen aufdreht ("Shred").
   3. COLLAPSE — zieht alle mit `data-warp` markierten Elemente zur Mitte,
                 drückt sie flach und legt sie auf eine der Wellenlinien.

   Ausgelöst wird das binär: Erstes Scroll-Event = 100 % an, 40 ms ohne
   Scroll-Event = wieder aus. Zwei unterschiedlich schnelle Interpolationen
   sorgen dafür, dass das Zerreißen sofort da ist, das Wandern auf die Welle
   aber einen Tick hinterherhinkt.

   Welche Elemente mitmachen, steht NICHT hier, sondern direkt im Markup der
   Sektionen: einfach `data-warp` an ein Element schreiben.

   WICHTIG — was NICHT als `data-warp` markiert werden darf:
   - `position: fixed`-Elemente und gepinnte Sektionen. Ein CSS-Filter
     erzeugt einen neuen Bezugsrahmen, fixierte Kinder würden mitscrollen.
   - Elemente, die GSAP bereits per transform animiert. Beide würden in
     dieselbe style-Eigenschaft schreiben und sich gegenseitig überschreiben.
     Deshalb sitzt `data-warp` immer auf einem Container DANEBEN.
   -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { WAVE_SHRED, waveY, waveSlope, hexToRgba } from "../lib/waveShred";
import "../styles/waveshred.css";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

export default function WaveShred({ children, config }) {
  const canvasRef = useRef(null);
  const warpRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);

  // Ein Ref, damit geänderte Werte den Effekt nicht neu starten.
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    const warp = warpRef.current;
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;
    const ctx = canvas.getContext("2d");

    const cfg = { ...WAVE_SHRED, ...(configRef.current || {}) };
    const reduceQuery = window.matchMedia(REDUCE_MOTION);

    /* ---- Zustand --------------------------------------------------------- */
    let width = 0;
    let height = 0;
    let time = 0;

    let targetWarp = 0; // 0 oder 1 — der binäre Auslöser
    let warpProgress = 0; // das Zerreißen — folgt sofort
    let mergeProgress = 0; // das Wandern auf die Welle — folgt verzögert
    let energy = 0; // Maximum aus beiden, treibt den Hintergrund

    let elements = [];
    let bounds = [];
    let boundsDirty = true;
    let shredding = false;

    let rafId = 0;
    let stopTimer = 0;

    /* Der Verzerrungs-Teil läuft nur auf breiten Bildschirmen und nur, wenn
       der Nutzer keine reduzierte Bewegung angefordert hat. Der Hintergrund
       läuft immer — er ist Teil des Seiten-Looks, nicht der Interaktion. */
    const shredAllowed = () =>
      !reduceQuery.matches && window.innerWidth >= cfg.minWidth;

    /* ---- Canvas auf Gerätepixel bringen ---------------------------------- */
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ---- Zielelemente einsammeln -----------------------------------------
       Verschachtelte Treffer fliegen raus: Läge `data-warp` auf Eltern UND
       Kind, würden sich die Transformationen multiplizieren. */
    function collectElements() {
      const all = Array.from(warp.querySelectorAll("[data-warp]"));
      elements = all.filter(
        (el) => !all.some((other) => other !== el && other.contains(el))
      );
    }

    /* ---- Ausgangsposition messen -----------------------------------------
       Die Elemente tragen während der Animation selbst ein transform. Für
       eine ehrliche Messung nehmen wir es kurz weg und setzen es zurück —
       das passiert nur im Ruhezustand, also nie mitten in einer Bewegung. */
    function cacheBounds() {
      const previous = elements.map((el) => el.style.transform);
      elements.forEach((el) => {
        el.style.transform = "none";
      });

      const scrollY = window.scrollY;
      bounds = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + scrollY + rect.height / 2,
        };
      });

      elements.forEach((el, index) => {
        el.style.transform = previous[index] || "";
      });
      boundsDirty = false;
    }

    /* ---- Alles auf Anfang ------------------------------------------------- */
    function resetElement(el) {
      if (!el.style.transform && !el.style.opacity && !el.style.filter) return;
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
    }

    function resetElements() {
      elements.forEach(resetElement);
    }

    function setShredding(on) {
      if (on === shredding) return;
      shredding = on;
      warp.classList.toggle("is-shredding", on);
    }

    /* Wie stark macht ein Element mit? 1 im Sichtfenster, dann linear
       auslaufend bis 0. Ein harter Schnitt würde Elemente mitten im Flug
       zurückspringen lassen — so blenden sie sanft aus der Bewegung aus.
       Nebeneffekt: Es sind immer nur wenige Elemente gleichzeitig in
       Bewegung, das hält die Bildrate oben. */
    function participation(centerY, range) {
      const distance =
        centerY < 0 ? -centerY : centerY > height ? centerY - height : 0;
      if (distance >= range) return 0;
      return 1 - distance / range;
    }

    /* ---- Hintergrund ------------------------------------------------------ */
    function drawBackground() {
      ctx.fillStyle = cfg.background;
      ctx.fillRect(0, 0, width, height);

      const amp = 1 + energy * 0.55;
      const state = { height, time, cfg };

      for (let line = 0; line < cfg.lines; line++) {
        // Beim Scrollen leuchten einzelne Linien kurz auf.
        const hot =
          energy *
          cfg.flare *
          (0.35 + 0.65 * Math.abs(Math.sin(line * 1.7 + time * 3)));
        // Leichter Helligkeitsverlauf von oben nach unten.
        const depth = 0.45 + (line / Math.max(1, cfg.lines - 1)) * 0.55;

        ctx.strokeStyle = hexToRgba(
          cfg.color,
          Math.min(1, cfg.opacity * depth + hot)
        );
        ctx.lineWidth = cfg.thickness * (1 + hot * 1.2);
        ctx.beginPath();

        for (let x = 0; x <= width; x += 6) {
          const jitter =
            energy *
            energy *
            Math.sin(x * 0.35 + time * 40 + line * 9) *
            40 *
            cfg.jitter;
          const y = waveY(x, line, amp, state) + jitter;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      time += 0.01 + energy * 0.05;
    }

    /* ---- Elemente auf die Welle legen ------------------------------------- */
    function moveElements() {
      /* Der Filter sitzt auf den Elementen und wirkt daher VOR deren
         transform. Ohne Ausgleich würde die Verzerrung mit der Streckung
         mitwachsen (Faktor 11) und das Element komplett zerstäuben. Geteilt
         durch die aktuelle Streckung bleibt der Riss auf dem Bildschirm
         gleich stark — kräftig im ersten Moment, wenn merge noch bei 0 steht. */
      const stretchNow = 1 + mergeProgress * cfg.stretch;
      displacement.setAttribute(
        "scale",
        ((warpProgress * cfg.displacementScale) / stretchNow).toFixed(2)
      );
      turbulence.setAttribute(
        "baseFrequency",
        `0.001 ${(0.1 + warpProgress * 0.1).toFixed(4)}`
      );

      const centerX = width / 2;
      const scrollY = window.scrollY;
      const amp = 1 + energy * 0.55;
      const state = { height, time, cfg };
      const range = height * cfg.cullViewports;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const box = bounds[i];
        if (!box) continue;

        const startX = box.x;
        const startY = box.y - scrollY;

        const weight = participation(startY, range);
        if (weight === 0) {
          resetElement(el);
          continue;
        }

        const shred = warpProgress * weight; // Zerreißen
        const merge = mergeProgress * weight; // Wandern auf die Welle

        // Nur teilweise zur Mitte ziehen — sonst klumpt alles auf einem Punkt
        // und die Elemente verteilen sich nicht mehr entlang der Welle.
        const pullX = (centerX - startX) * 0.65;
        const targetX = startX + pullX * merge;

        // Jedes Element bekommt fest seine eigene Linie zugewiesen.
        const line = (i * 5) % cfg.lines;
        const lineY = cfg.snapToWave
          ? waveY(targetX, line, amp, state)
          : height / 2;
        const slope = cfg.snapToWave ? waveSlope(targetX, line, amp, state) : 0;

        const tx = pullX * merge;
        const ty = (lineY - startY) * merge;
        const rotation = Math.atan(slope) * (180 / Math.PI) * merge;
        const scaleX = 1 + merge * cfg.stretch;
        const scaleY = 1 - merge * 0.94; // flach wie ein Strich auf der Linie
        const blur = shred * cfg.blur;

        el.style.transform =
          `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
          `rotate(${rotation.toFixed(2)}deg) ` +
          `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        el.style.opacity = String(1 - merge * 0.75);
        /* Der Verzerrungsfilter hängt bewusst am einzelnen Element, nicht am
           Seiten-Wrapper: Über die volle Seitenhöhe gelegt bricht er die
           Bildrate auf wenige Frames pro Sekunde ein, pro Element bleibt sie
           bei 60. */
        el.style.filter =
          `url(#wave-shred-warp)${blur > 0.05 ? ` blur(${blur.toFixed(2)}px)` : ""}`;
      }
    }

    /* ---- Bildschleife ----------------------------------------------------- */
    function frame() {
      // Harte Interpolation: warpProgress ist praktisch sofort am Ziel,
      // mergeProgress zieht deutlich langsamer nach.
      warpProgress += (targetWarp - warpProgress) * cfg.snapSpeed;
      mergeProgress += (warpProgress - mergeProgress) * cfg.mergeSpeed;

      if (warpProgress < 0.0015 && targetWarp === 0) {
        warpProgress = 0;
        mergeProgress *= 0.5;
      }
      if (mergeProgress < 0.0015) mergeProgress = 0;

      energy = Math.max(warpProgress, mergeProgress);

      drawBackground();

      const idle = warpProgress === 0 && mergeProgress === 0;

      if (idle) {
        setShredding(false);
        resetElements();
        // Neu vermessen nur in Ruhe — dann steht kein transform im Weg.
        if (boundsDirty) {
          collectElements();
          cacheBounds();
        }
      } else {
        setShredding(true);
        moveElements();
      }

      rafId = requestAnimationFrame(frame);
    }

    /* ---- Ereignisse ------------------------------------------------------- */
    function onScroll() {
      if (!shredAllowed()) return;
      targetWarp = 1;
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        targetWarp = 0;
      }, cfg.stopDelay);
    }

    function onResize() {
      resizeCanvas();
      boundsDirty = true;
      if (!shredAllowed()) {
        targetWarp = 0;
        clearTimeout(stopTimer);
      }
    }

    function onMotionPreferenceChange() {
      if (reduceQuery.matches) {
        targetWarp = 0;
        clearTimeout(stopTimer);
      }
    }

    resizeCanvas();
    collectElements();
    cacheBounds();
    // Nach dem ersten Layout (Webfonts, Bilder) noch einmal nachmessen.
    requestAnimationFrame(() => {
      boundsDirty = true;
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduceQuery.addEventListener("change", onMotionPreferenceChange);

    /* Tab-Wechsel, nachgeladene Bilder, aufklappende Panels — alles ändert
       die Höhe des Inhalts und damit die gemessenen Positionen. */
    const resizeObserver = new ResizeObserver(() => {
      boundsDirty = true;
    });
    resizeObserver.observe(warp);

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(stopTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduceQuery.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      setShredding(false);
      resetElements();
    };
  }, []);

  return (
    <>
      {/* ---- Der Verzerrungsfilter ------------------------------------------
          feTurbulence erzeugt ein Rauschbild, feDisplacementMap verschiebt
          damit die Pixel des Inhalts. `scale` steht in Ruhe auf 0 — die
          Bildschleife dreht den Wert beim Scrollen hoch. */}
      <svg className="wave-shred__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="wave-shred-warp"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.001 0.15"
              /* Eine Oktave reicht: Die zweite kostet spürbar Bildrate,
                 sieht bei dieser Verzerrungsstärke aber praktisch gleich aus. */
              numOctaves="1"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <canvas className="wave-shred__canvas" ref={canvasRef} aria-hidden="true" />

      <div className="wave-shred__warp" ref={warpRef}>
        {children}
      </div>
    </>
  );
}
