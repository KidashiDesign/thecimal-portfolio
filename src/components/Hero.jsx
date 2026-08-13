/* --------------------------------------------------------------------------
   2. HERO
   --------------------------------------------------------------------------
   - Hintergrund: die Wellen-Animation aus WaveShred (App.jsx) scheint durch
   - riesige zweizeilige Headline, die buchstabenweise von unten einfliegt
   - kleine Infoblöcke (Name, Rolle, Kontakt, Jahr) folgen zeitversetzt
   - Scroll-Indikator unten, der beim Scrollen ausfadet

   Texte: src/content.js  →  export const hero
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { SplitChars } from "./Split";
import { hero } from "../content";
import "../styles/hero.css";

export default function Hero() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ---- Variante A: normale Bewegung -------------------------------- */
      mm.add(MEDIA.fullMotion, () => {
        const intro = gsap.timeline({ delay: 0.2 });

        intro
          // Headline: jeder Buchstabe kommt aus seiner Maske nach oben
          .from(
            ".hero__headline .split-char",
            {
              yPercent: 115,
              duration: 1.1,
              ease: "power4.out",
              stagger: { each: 0.05, from: "start" },
            },
            "-=1.1"
          )
          // Infoblöcke danach
          .from(
            ".hero__info-item",
            {
              autoAlpha: 0,
              y: 24,
              duration: 0.8,
              stagger: 0.08,
            },
            "-=0.55"
          )
          .from(
            ".hero__scroll",
            { autoAlpha: 0, y: -14, duration: 0.6 },
            "-=0.4"
          );

        /* Scroll-Indikator verschwindet, sobald man losscrollt */
        gsap.to(".hero__scroll", {
          autoAlpha: 0,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=25%",
            scrub: true,
          },
        });

        /* Headline wandert beim Wegscrollen leicht nach oben und blendet ab */
        gsap.to(".hero__content", {
          yPercent: -12,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* ---- Variante B: Bewegung reduziert ------------------------------ */
      mm.add(MEDIA.reduceMotion, () => {
        // Kein Scrub, kein Parallax — nur ein ruhiges Einblenden.
        gsap.from(".hero__content", {
          autoAlpha: 0,
          duration: 0.4,
          ease: "none",
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section className="hero" id="hero" ref={rootRef}>
      {/* ---- Inhalt --------------------------------------------------------- */}
      <div className="hero__content">
        <p className="hero__tagline hero__info-item">{hero.tagline}</p>

        {/* data-warp: klappt beim Scrollen auf die Wellenlinie (WaveShred).
            Sitzt auf der Überschrift, nicht auf `.hero__content` — den
            bewegt GSAP bereits per Parallax. */}
        <h1 className="hero__headline" data-warp>
          <span className="hero__headline-line">
            <SplitChars text={hero.headlineTop} />
          </span>
          <span className="hero__headline-line hero__headline-line--bottom">
            <SplitChars text={hero.headlineBottom} />
          </span>
        </h1>

        <div className="hero__info" data-warp>
          <div className="hero__info-item">
            <span className="hero__info-label">{hero.artistLabel}</span>
            <span className="hero__info-value">{hero.founderName}</span>
            <span className="hero__info-value hero__info-value--dim">
              {hero.founderRole}
            </span>
          </div>

          <div className="hero__info-item">
            <span className="hero__info-label">{hero.contactLabel}</span>
            <a className="hero__info-value" href={`mailto:${hero.contactEmail}`}>
              {hero.contactEmail}
            </a>
            <a
              className="hero__info-value hero__info-value--dim"
              href={`tel:${hero.contactPhone.replace(/\s/g, "")}`}
            >
              {hero.contactPhone}
            </a>
          </div>

          <div className="hero__info-item hero__info-item--year">
            <span className="hero__info-label">{hero.yearLabel}</span>
            <span className="hero__info-value">{hero.year}</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span>{hero.scrollIndicator}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </div>
    </section>
  );
}
