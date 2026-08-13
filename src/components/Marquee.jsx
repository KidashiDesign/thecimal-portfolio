/* --------------------------------------------------------------------------
   7. MARQUEE — Endlos-Laufschrift
   --------------------------------------------------------------------------
   Der Trick: der Textblock steht ZWEIMAL nebeneinander im DOM. Animiert
   wird um -50 % — genau eine Kopie. In dem Moment, in dem die erste Kopie
   ganz links rausgelaufen ist, steht die zweite exakt an ihrer Startposition.
   Der Sprung zurück auf 0 ist deshalb unsichtbar.

   Bei Hover wird die Animation nicht gestoppt, sondern verlangsamt
   (timeScale) — das wirkt weicher als ein harter Stopp.

   Text: src/content.js  →  export const marquee
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { marquee } from "../content";
import "../styles/marquee.css";

export default function Marquee() {
  const rootRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        tweenRef.current = gsap.to(".marquee__row", {
          xPercent: -50,
          repeat: -1,
          duration: marquee.durationSeconds,
          ease: "none",
        });

        /* Zusätzlich: beim Scrollen bekommt die Laufschrift einen kleinen
           Schub in Scrollrichtung. Das verbindet sie mit der Seite.
           Wichtig: Das läuft auf der ÄUSSEREN Ebene (.marquee__inner) —
           würden beide Animationen dasselbe Element verschieben, würden
           sie sich gegenseitig überschreiben und es ruckelt. */
        gsap.fromTo(
          ".marquee__inner",
          { xPercent: 3 },
          {
            xPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        return () => {
          tweenRef.current = null;
        };
      });

      /* Bei reduzierter Bewegung läuft gar nichts — der Text steht still. */

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Hover: auf ein Viertel der Geschwindigkeit abbremsen */
  const slowDown = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0.25, duration: 0.6 });
  };

  const speedUp = () => {
    if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 });
  };

  // Der Inhalt wird doppelt gerendert (siehe Kommentar oben).
  const row = (
    <>
      {marquee.words.map((word, index) => (
        <span className="marquee__item" key={index}>
          {word}
          <span className="marquee__sep" aria-hidden="true">
            {marquee.separator}
          </span>
        </span>
      ))}
    </>
  );

  return (
    /* data-warp sitzt hier auf der Sektion selbst: Die beiden inneren Ebenen
       bewegt GSAP bereits (`.marquee__inner` per Scroll, `.marquee__row` als
       Dauerschleife) — ein transform von außen würde sich mit beiden
       überschreiben. */
    <section
      className="marquee"
      data-warp
      ref={rootRef}
      onMouseEnter={slowDown}
      onMouseLeave={speedUp}
      aria-label={marquee.words.join(", ")}
    >
      <div className="marquee__inner">
        <div className="marquee__row" aria-hidden="true">
          {row}
          {row}
        </div>
      </div>
    </section>
  );
}
