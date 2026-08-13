/* --------------------------------------------------------------------------
   3. STATEMENT — Text hellt sich beim Scrollen Wort für Wort auf
   --------------------------------------------------------------------------
   Der Absatz wird in ein <span> pro Wort zerlegt. Alle Wörter starten
   gedimmt (opacity 0.15). Über `scrub: true` hängt der Fortschritt der
   Animation direkt am Scrollrad: scrollst du zurück, dunkeln die Wörter
   wieder ab.

   Text: src/content.js  →  export const statement
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { SplitWords } from "./Split";
import { statement } from "../content";
import "../styles/statement.css";

export default function Statement() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        gsap.fromTo(
          ".statement__text .split-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            // `stagger` verteilt die Wörter über die gesamte Scroll-Strecke.
            // Der konkrete Wert ist bei scrub egal — entscheidend ist das
            // Verhältnis zur duration.
            stagger: 1,
            duration: 1,
            scrollTrigger: {
              trigger: rootRef.current,
              // Start: Sektion ist zu 3/4 hochgescrollt
              start: "top 72%",
              // Ende: unteres Ende der Sektion erreicht die Bildschirmmitte
              end: "bottom 55%",
              scrub: true,
            },
          }
        );

        gsap.from(".statement__meta", {
          autoAlpha: 0,
          y: 24,
          scrollTrigger: {
            trigger: ".statement__meta",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      /* Reduzierte Bewegung: kein Scrub. Der Text ist sofort voll lesbar
         und blendet nur einmal sanft ein. */
      mm.add(MEDIA.reduceMotion, () => {
        gsap.set(".statement__text .split-word", { opacity: 1 });
        gsap.from(".statement__inner", {
          autoAlpha: 0,
          duration: 0.4,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%" },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section className="section statement" id="statement" ref={rootRef}>
      <div className="statement__inner">
        <p className="eyebrow" data-warp>
          {statement.eyebrow}
        </p>

        {/* data-warp sitzt auf dem Absatz, das Aufhellen läuft auf den
            Wörtern darin — zwei Ebenen, kein Streit um `transform`. */}
        <p className="statement__text" data-warp>
          <SplitWords text={statement.text} />
        </p>

        <p className="statement__meta">{statement.footnote}</p>
      </div>
    </section>
  );
}
