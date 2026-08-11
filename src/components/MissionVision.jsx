/* --------------------------------------------------------------------------
   4. MISSION / VISION
   --------------------------------------------------------------------------
   - zwei Toggle-Tabs, die per Crossfade zwischen zwei Textblöcken wechseln
   - daneben drei überlappende Bilder, die beim Scrollen unterschiedlich
     schnell wandern (Parallax)

   Texte:  src/content.js  →  export const missionVision
   Bilder: src/content.js  →  export const missionImages  (Feld `speed`
           steuert, wie stark sich das jeweilige Bild bewegt)
   -------------------------------------------------------------------------- */

import { useRef, useState } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { missionVision, missionImages } from "../content";
import "../styles/mission.css";

export default function MissionVision() {
  const rootRef = useRef(null);
  const firstRunRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---- Parallax + Einblenden (läuft einmal beim Mount) -------------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        // Jedes Bild bekommt seine eigene Geschwindigkeit aus content.js.
        gsap.utils.toArray(".mission__image").forEach((image, index) => {
          const speed = missionImages[index]?.speed ?? 0.5;

          gsap.fromTo(
            image,
            { yPercent: speed * 14 },
            {
              yPercent: speed * -14,
              ease: "none",
              scrollTrigger: {
                trigger: ".mission__cluster",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        gsap.from(".mission__cluster figure", {
          autoAlpha: 0,
          y: 40,
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".mission__cluster",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".mission__head > *", {
          autoAlpha: 0,
          y: 28,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".mission__head",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add(MEDIA.reduceMotion, () => {
        gsap.from(".mission__inner", {
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

  /* ---- Crossfade beim Tab-Wechsel ----------------------------------------
     Beide Textblöcke liegen im selben Raster-Feld übereinander. Beim Wechsel
     blenden wir den alten aus und den neuen ein. */
  useGSAP(
    () => {
      const panels = gsap.utils.toArray(".mission__panel");
      // Beim allerersten Durchlauf soll nichts animiert werden — sonst
      // sieht man beide Panels kurz gleichzeitig.
      const duration = firstRunRef.current ? 0 : 0.45;
      firstRunRef.current = false;

      panels.forEach((panel, index) => {
        const isActive = index === activeIndex;

        gsap.to(panel, {
          autoAlpha: isActive ? 1 : 0, // autoAlpha = opacity + visibility
          y: isActive ? 0 : 12,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      if (!duration) return;

      // Der aktive Block bekommt zusätzlich einen kleinen Zeilen-Stagger.
      const activeLines = gsap.utils.toArray(
        `.mission__panel[data-index="${activeIndex}"] .mission__panel-item`
      );
      gsap.fromTo(
        activeLines,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }
      );
    },
    { scope: rootRef, dependencies: [activeIndex] }
  );

  return (
    <section className="section mission" id="mission" ref={rootRef}>
      <div className="mission__inner">
        {/* ---- Textspalte -------------------------------------------------- */}
        <div className="mission__col">
          <div className="mission__head">
            <p className="eyebrow">{missionVision.eyebrow}</p>

            {/* Tabs */}
            <div className="mission__tabs" role="tablist" aria-label={missionVision.eyebrow}>
              {missionVision.tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={index === activeIndex}
                  aria-controls={`panel-${tab.id}`}
                  className={`mission__tab ${index === activeIndex ? "is-active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panels — liegen übereinander und werden übergeblendet */}
          <div className="mission__panels">
            {missionVision.tabs.map((tab, index) => (
              <div
                key={tab.id}
                id={`panel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                data-index={index}
                className={`mission__panel ${index === activeIndex ? "is-active" : ""}`}
                // inert nimmt den inaktiven Block aus Tastatur- und
                // Screenreader-Navigation heraus
                inert={index !== activeIndex}
              >
                <h2 className="mission__panel-headline mission__panel-item">
                  {tab.headline}
                </h2>
                <p className="mission__panel-body mission__panel-item">{tab.body}</p>
                <ul className="mission__points">
                  {tab.points.map((point) => (
                    <li className="mission__panel-item" key={point}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Bild-Cluster ------------------------------------------------ */}
        <div className="mission__cluster">
          {missionImages.map((image, index) => (
            <figure className={`mission__figure mission__figure--${index + 1}`} key={image.src}>
              <img
                className="mission__image"
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
