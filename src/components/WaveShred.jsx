/* --------------------------------------------------------------------------
   WAVE SHRED — "Center Collapse & Wave Shred"
   --------------------------------------------------------------------------
   Umsetzung der Vorlage (index.html) für diese Seite. Drei Teile:

   1. CANVAS   — die animierten Wellenlinien hinter der Seite.
   2. FILTER   — ein SVG-Verzerrungsfilter, der ÜBER DEM GESAMTEN Inhalt
                 liegt und beim Scrollen aufdreht ("Shred").
   3. COLLAPSE — alle mit `data-warp` markierten Elemente fahren in die
                 exakte Bildschirmmitte und werden dabei breitgezogen.

   Ausgelöst wird binär: erstes Scroll-Event = 100 %, 40 ms ohne Scroll-Event
   = wieder 0. Dazwischen legt der Wert pro Bild 90 % der Reststrecke zurück.

   WICHTIG — der Filter gehört auf den WRAPPER, nicht auf die Elemente.
   Auf den einzelnen Elementen wirkt er vor deren `scaleX(11)` und wird
   dadurch mitgestreckt: Die Verzerrung fransst dann seitlich aus, statt die
   Seite als Ganzes zu zerreißen. Genau so steht es auch in der Vorlage.

   WICHTIG — was NICHT `data-warp` bekommen darf:
   - Elemente, die GSAP per transform bewegt (Reveals, Parallax, Marquee).
     Beide schreiben in dieselbe style-Eigenschaft und überschreiben sich
     gegenseitig. `data-warp` sitzt deshalb immer auf einem Element daneben
     oder darüber — die Liste der GSAP-Ziele steht in den Sektionen selbst.
   - `position: fixed`-Elemente. Der Filter spannt einen neuen Bezugsrahmen
     auf, fixierte Kinder würden mitscrollen. Die Navigation liegt deshalb
     außerhalb; gepinnte Sektionen laufen über `pinType: "transform"`
     (siehe src/lib/gsap.js).
   -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { WAVE_SHRED, waveY, hexToRgba } from "../lib/waveShred";
import "../styles/waveshred.css";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

export default function WaveShred({ children, config }) {
  const canvasRef = useRef(null);
  const warpRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);

  // Ref, damit geänderte Werte den Effekt nicht neu starten.
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
    let warpProgress = 0; // der weich nachgezogene Wert
    let lastFrame = 0; // Zeitstempel des letzten Bildes
    let lastScrollY = window.scrollY;

    let elements = [];
    let positions = [];
    let frames = []; // Bezugsrahmen je Element (meist null) — siehe measure()
    let measured = false;
    let enabled = false;

    let rafId = 0;

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
      frames = elements.map((el) => el.closest("[data-warp-frame]"));
      measured = false;
    }

    /* ---- Ausgangsposition messen -----------------------------------------
       Wie in der Vorlage wird EINMAL gemessen und danach pro Bild nur noch
       gerechnet. Pro Bild neu zu messen wäre das Naheliegende, kostet aber
       für jedes Element ein erzwungenes Neu-Layout — bei gesetztem Filter
       bricht die Bildrate dadurch ein.

       Zwei Bezugssysteme:
       - Normalfall (frame === null): Position im Dokument. Auf dem Bildschirm
         ist das schlicht `y - scrollY` — genau wie in der Vorlage.
       - Innerhalb eines `data-warp-frame`: Dort verschiebt GSAP den Rahmen
         selbst (Hero-Parallax, Pinning und seitlicher Lauf der Meilensteine),
         "Dokumentposition minus Scrollstand" stimmt dann nicht mehr. Diese
         Elemente merken sich den Abstand zu ihrem Rahmen; pro Bild wird nur
         DESSEN Position abgefragt — drei Messungen statt einer pro Element. */
    function measure() {
      const previous = elements.map((el) => el.style.transform);
      elements.forEach((el) => {
        el.style.transform = "none";
      });

      const scrollY = window.scrollY;
      const frameRects = new Map();

      positions = elements.map((el, index) => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const frame = frames[index];

        if (!frame) return { x, y: y + scrollY };

        if (!frameRects.has(frame)) {
          frameRects.set(frame, frame.getBoundingClientRect());
        }
        const frameRect = frameRects.get(frame);
        return { x: x - frameRect.left, y: y - frameRect.top };
      });

      elements.forEach((el, index) => {
        el.style.transform = previous[index] || "";
      });
      measured = true;
    }

    function resetElements() {
      elements.forEach((el) => {
        if (el.style.transform) el.style.transform = "";
      });
    }

    /* Filter und will-change hängen dauerhaft am Wrapper, solange der Effekt
       aktiv ist — genau wie in der Vorlage. Würden wir sie beim Stillstand
       abhängen, änderte sich jedes Mal die Textglättung und die Schrift
       würde sichtbar "umspringen". */
    function setEnabled(on) {
      if (on === enabled) return;
      enabled = on;
      warp.classList.toggle("is-warping", on);
      if (!on) {
        targetWarp = 0;
        warpProgress = 0;
        displacement.setAttribute("scale", "0");
        resetElements();
      }
    }

    /* ---- Hintergrund ------------------------------------------------------ */
    function drawBackground(delta) {
      ctx.fillStyle = cfg.background;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = hexToRgba(cfg.color, cfg.opacity);
      ctx.lineWidth = 1;

      for (let line = 0; line < cfg.lines; line++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 10) {
          const y = waveY(x, line, height, time);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Auch die Wellen laufen über die Zeit, nicht pro Bild — sonst werden
      // sie langsamer, sobald die Bildrate nachgibt.
      time += 0.01 * (delta / 16.7);
    }

    /* ---- Elemente in die Bildmitte ziehen --------------------------------- */
    function moveElements() {
      const centerX = width / 2;
      const centerY = height / 2;
      const scrollY = window.scrollY;
      const scaleX = 1 + warpProgress * cfg.stretch;
      /* Nicht ganz bis zur Mitte: Sonst deckt der Effekt die eigenen
         Scroll-Animationen der Seite komplett zu (siehe maxCollapse). */
      const travel = warpProgress * cfg.maxCollapse;

      // Jeder Rahmen wird pro Bild genau einmal gemessen, nicht pro Element.
      const frameRects = new Map();
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (frame && !frameRects.has(frame)) {
          frameRects.set(frame, frame.getBoundingClientRect());
        }
      }

      for (let i = 0; i < elements.length; i++) {
        const frame = frames[i];
        let screenX;
        let screenY;

        if (frame) {
          const frameRect = frameRects.get(frame);
          screenX = frameRect.left + positions[i].x;
          screenY = frameRect.top + positions[i].y;
        } else {
          screenX = positions[i].x;
          screenY = positions[i].y - scrollY;
        }

        const distanceX = centerX - screenX;
        const distanceY = centerY - screenY;

        elements[i].style.transform =
          `translate(${(distanceX * travel).toFixed(2)}px, ` +
          `${(distanceY * travel).toFixed(2)}px) ` +
          `scaleX(${scaleX.toFixed(3)})`;
      }
    }

    /* ---- Bildschleife ----------------------------------------------------- */
    function frame(now) {
      /* Zeit seit dem letzten Bild. Für die Interpolation nach oben begrenzt,
         damit ein einzelner Aussetzer (Tab im Hintergrund) nicht auf einen
         Schlag durchspringt. Die Geschwindigkeit rechnet mit der ECHTEN
         Zeit — sonst käme bei einem langen Bild ein zu hoher Wert heraus. */
      const elapsed = now - lastFrame || 16.7;
      const delta = Math.min(elapsed, 100);
      lastFrame = now;

      drawBackground(delta);

      if (enabled) {
        /* Auslöser: die tatsächliche Scroll-Geschwindigkeit. Kein Timer, kein
           Scroll-Event — der weiche Auslauf von Lenis wird dadurch von selbst
           schwächer, statt bis zum letzten Event auf voller Stärke zu bleiben.
           Unterhalb von minSpeed ist ganz Schluss, sonst würde die Seite bei
           minimalen Positionssprüngen leise flimmern. */
        const scrolled = window.scrollY;
        const speed = Math.abs(scrolled - lastScrollY) / elapsed;
        lastScrollY = scrolled;

        targetWarp =
          speed < cfg.minSpeed
            ? 0
            : Math.min(1, (speed - cfg.minSpeed) / (cfg.fullSpeed - cfg.minSpeed));

        /* Exponentielle Annäherung über die ZEIT, nicht pro Bild: Bei 60 fps
           und bei 20 fps dauert Hin- und Rückweg gleich lang. */
        const tau = targetWarp > warpProgress ? cfg.attack : cfg.release;
        warpProgress += (targetWarp - warpProgress) * (1 - Math.exp(-delta / tau));
        if (warpProgress < 0.002 && targetWarp === 0) warpProgress = 0;

        displacement.setAttribute(
          "scale",
          (warpProgress * cfg.displacementScale).toFixed(2)
        );
        turbulence.setAttribute(
          "baseFrequency",
          `0.001 ${(0.1 + warpProgress * 0.1).toFixed(4)}`
        );

        if (warpProgress === 0) {
          resetElements();
          // Nur im Ruhezustand nachmessen — dann steht kein transform im Weg.
          if (!measured) measure();
        } else {
          if (!measured) measure();
          moveElements();
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    /* ---- Ereignisse ------------------------------------------------------- */
    function onResize() {
      resizeCanvas();
      measured = false;
      setEnabled(shredAllowed());
    }

    resizeCanvas();
    collectElements();
    setEnabled(shredAllowed());

    window.addEventListener("resize", onResize);
    reduceQuery.addEventListener("change", onResize);

    /* Tab-Wechsel, nachgeladene Bilder, aufklappende Panels — alles ändert
       die Positionen. Neu eingehängte Elemente werden ebenfalls erfasst. */
    const observer = new MutationObserver(() => {
      collectElements();
    });
    observer.observe(warp, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(() => {
      measured = false;
    });
    resizeObserver.observe(warp);

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      reduceQuery.removeEventListener("change", onResize);
      observer.disconnect();
      resizeObserver.disconnect();
      setEnabled(false);
    };
  }, []);

  return (
    <>
      {/* ---- Der Verzerrungsfilter ------------------------------------------
          feTurbulence erzeugt ein Rauschbild, feDisplacementMap verschiebt
          damit die Pixel des Inhalts. `scale` steht in Ruhe auf 0 — die
          Bildschleife dreht den Wert beim Scrollen hoch. Werte wie in der
          Vorlage. */}
      <svg className="wave-shred__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="wave-shred-warp"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.001 0.15"
              numOctaves="1"
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
