/* --------------------------------------------------------------------------
   9. CTA — "Sag Hallo"
   --------------------------------------------------------------------------
   - große zweizeilige Headline, buchstabenweise eingeblendet
   - Bild-Grid darunter, jedes Bild zoomt beim Hover leicht an
   - prominenter Button

   Inhalte: src/content.js  →  export const cta
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { SplitChars } from "./Split";
import { cta } from "../content";
import { asset } from "../lib/asset";
import "../styles/cta.css";

export default function CallToAction() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        timeline
          .from(".cta__eyebrow", { autoAlpha: 0, y: 20, duration: 0.6 })
          .from(
            ".cta__headline .split-char",
            {
              yPercent: 115,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.045,
            },
            "-=0.3"
          )
          .from(
            ".cta__text, .cta__button",
            { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.1 },
            "-=0.45"
          );

        // Bilder erscheinen einzeln, sobald das Grid in Sicht kommt
        gsap.from(".cta__tile", {
          autoAlpha: 0,
          y: 50,
          duration: 0.9,
          stagger: 0.09,
          scrollTrigger: { trigger: ".cta__grid", start: "top 88%" },
        });
      });

      mm.add(MEDIA.reduceMotion, () => {
        gsap.from(".cta__inner", {
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
    <section className="section cta" id="kontakt" ref={rootRef}>
      <div className="cta__inner">
        <p className="eyebrow cta__eyebrow">{cta.eyebrow}</p>

        <h2 className="cta__headline" data-warp>
          <span className="cta__headline-line">
            <SplitChars text={cta.headlineTop} />
          </span>
          <span className="cta__headline-line cta__headline-line--bottom">
            <SplitChars text={cta.headlineBottom} />
          </span>
        </h2>

        <div className="cta__row" data-warp>
          <p className="cta__text">{cta.text}</p>
          <a className="button cta__button" href={cta.buttonHref}>
            {cta.buttonLabel}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="cta__grid">
          {cta.images.map((image) => (
            <figure className="cta__tile" key={image.src}>
              <img src={asset(image.src)} alt={image.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
