/* --------------------------------------------------------------------------
   5. MEILENSTEINE — horizontales Scrollen mit Pinning
   --------------------------------------------------------------------------
   Auf dem Desktop bleibt die Sektion beim Scrollen stehen ("pin"), während
   die Panels seitlich durchlaufen. Der vertikale Scroll-Weg wird dabei in
   eine horizontale Bewegung übersetzt.

   Auf Mobile und bei "Bewegung reduzieren" gibt es kein Pinning: die Panels
   stehen dann einfach untereinander (siehe milestones.css).

   Inhalte: src/content.js  →  export const milestones
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MEDIA } from "../lib/gsap";
import Odometer, { rollOdometer } from "./Odometer";
import { milestones } from "../content";
import { asset } from "../lib/asset";
import "../styles/milestones.css";

export default function Milestones() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Achtung, GSAP-Eigenheit: Bei einem Bedingungs-Objekt läuft die
         Funktion nur, wenn MINDESTENS eine Bedingung zutrifft. `isMobile`
         muss deshalb mit rein — sonst passierte auf dem Handy ohne
         reduzierte Bewegung gar nichts (die Zähler blieben auf 00 stehen). */
      mm.add(
        {
          isDesktop: MEDIA.desktop,
          isMobile: MEDIA.mobile,
          isReduced: MEDIA.reduceMotion,
        },
        (context) => {
          const { isDesktop, isReduced } = context.conditions;
          const track = trackRef.current;
          const viewport = viewportRef.current;
          const panels = gsap.utils.toArray(".milestone", track);

          /* ================================================================
             FALL 1 — Mobile oder "Bewegung reduzieren":
             Panels stehen untereinander, jeder zählt hoch, wenn er ins Bild
             kommt. Kein Pin, kein Scrub.
             ================================================================ */
          if (!isDesktop || isReduced) {
            // Etwaige Reste einer vorherigen Desktop-Animation entfernen
            gsap.set(track, { clearProps: "transform" });

            panels.forEach((panel) => {
              ScrollTrigger.create({
                trigger: panel,
                start: "top 80%",
                once: true,
                onEnter: () => rollOdometer(panel, isReduced),
              });

              if (!isReduced) {
                gsap.from(panel, {
                  autoAlpha: 0,
                  y: 40,
                  duration: 0.8,
                  scrollTrigger: { trigger: panel, start: "top 85%" },
                });
              }
            });
            return;
          }

          /* ================================================================
             FALL 2 — Desktop mit voller Bewegung: horizontales Pinning
             ================================================================ */

          // Wie weit muss der Track wandern, damit das letzte Panel bündig
          // am rechten Rand steht?
          const getDistance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          // Diese Strecke als Prozentwert der Track-Breite ausgedrückt —
          // so bleibt die Animation bei Größenänderungen korrekt.
          const getShiftPercent = () => -(getDistance() / track.scrollWidth) * 100;

          const horizontal = gsap.to(track, {
            xPercent: getShiftPercent,
            ease: "none", // Pflicht: sonst passt containerAnimation unten nicht
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              // Scroll-Strecke = horizontale Strecke → 1:1-Gefühl
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 1, // 1 Sekunde "Nachlauf" — fühlt sich weicher an
              anticipatePin: 1,
              invalidateOnRefresh: true, // bei Resize neu berechnen
            },
          });

          /* Fortschrittsbalken unter den Panels */
          gsap.fromTo(
            ".milestones__progress-bar",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: () => `+=${getDistance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );

          /* Pro Panel ein eigener Trigger.
             `containerAnimation` sagt ScrollTrigger: "dieses Element bewegt
             sich horizontal in der Animation `horizontal`" — dadurch lassen
             sich Positionen wie "left 70%" ganz normal verwenden. */
          panels.forEach((panel) => {
            ScrollTrigger.create({
              trigger: panel,
              containerAnimation: horizontal,
              start: "left 75%",
              once: true,
              onEnter: () => rollOdometer(panel),
            });

            gsap.from(panel.querySelectorAll(".milestone__reveal"), {
              autoAlpha: 0,
              y: 30,
              duration: 0.8,
              stagger: 0.08,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontal,
                start: "left 85%",
              },
            });
          });
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    /* Hinweis: In dieser Sektion sitzt bewusst KEIN `data-warp`.
       Sie wird beim Scrollen gepinnt — während des Pins stimmt der
       Zusammenhang zwischen Dokumentposition und Bildschirmposition nicht
       mehr, den WaveShred für seine Zielberechnung braucht. Die Elemente
       würden auf die falsche Wellenlinie springen. */
    <section className="milestones" id="meilensteine" ref={rootRef}>
      <header className="milestones__head">
        <p className="eyebrow">{milestones.eyebrow}</p>
        <h2 className="headline milestones__headline">{milestones.headline}</h2>
      </header>

      <div className="milestones__viewport" ref={viewportRef}>
        <div className="milestones__track" ref={trackRef}>
          {milestones.panels.map((panel, index) => (
            <article className="milestone" key={panel.year + panel.label}>
              <div className="milestone__body">
                <span className="milestone__index milestone__reveal">
                  {String(index + 1).padStart(2, "0")} / {String(milestones.panels.length).padStart(2, "0")}
                </span>

                <div className="milestone__number">
                  <Odometer value={panel.value} suffix={panel.suffix} />
                </div>

                <div className="milestone__meta milestone__reveal">
                  <span className="milestone__year">{panel.year}</span>
                  <span className="milestone__label">{panel.label}</span>
                </div>

                <p className="milestone__text milestone__reveal">{panel.text}</p>
              </div>

              <figure className="milestone__figure milestone__reveal">
                <img src={asset(panel.image)} alt={panel.alt} loading="lazy" decoding="async" />
              </figure>
            </article>
          ))}
        </div>
      </div>

      <div className="milestones__progress" aria-hidden="true">
        <span className="milestones__progress-bar" />
      </div>
    </section>
  );
}
