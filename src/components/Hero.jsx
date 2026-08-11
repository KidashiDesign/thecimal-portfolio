/* --------------------------------------------------------------------------
   2. HERO
   --------------------------------------------------------------------------
   - vollflächiges Hintergrundvideo (stumm, Loop, Autoplay)
   - riesige zweizeilige Headline, die buchstabenweise von unten einfliegt
   - kleine Infoblöcke (Name, Rolle, Kontakt, Jahr) folgen zeitversetzt
   - Scroll-Indikator unten, der beim Scrollen ausfadet

   Texte/Bilder: src/content.js  →  export const hero

   HINWEIS ZUM VIDEO
   Solange unter dem Pfad `hero.backgroundVideo` keine Datei liegt, zeigt der
   Browser automatisch das Standbild aus `hero.posterImage`. Du kannst also
   erst mal ohne Video arbeiten und später einfach die mp4-Datei nach
   public/placeholder/ legen.
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { SplitChars } from "./Split";
import { hero } from "../content";
import { asset } from "../lib/asset";
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
          // Hintergrund langsam aufblenden und minimal herauszoomen
          .from(".hero__media", {
            autoAlpha: 0,
            scale: 1.12,
            duration: 1.6,
            ease: "power2.out",
          })
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

        /* Leichter Parallax: der Hintergrund scrollt langsamer als der Text */
        gsap.to(".hero__media", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
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
        gsap.from(".hero__content, .hero__media", {
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
      {/* ---- Hintergrund ---------------------------------------------------- */}
      <div className="hero__media">
        <video
          className="hero__video"
          src={asset(hero.backgroundVideo)}
          poster={asset(hero.posterImage)}
          autoPlay
          muted
          loop
          playsInline
          // Hero-Medien NICHT lazy laden — sie sind sofort sichtbar.
          preload="auto"
          aria-label={hero.posterAlt}
        />
        <div className="hero__scrim" aria-hidden="true" />
      </div>

      {/* ---- Inhalt --------------------------------------------------------- */}
      <div className="hero__content">
        <p className="hero__tagline hero__info-item">{hero.tagline}</p>

        <h1 className="hero__headline">
          <span className="hero__headline-line">
            <SplitChars text={hero.headlineTop} />
          </span>
          <span className="hero__headline-line hero__headline-line--bottom">
            <SplitChars text={hero.headlineBottom} />
          </span>
        </h1>

        <div className="hero__info">
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
