/* --------------------------------------------------------------------------
   8. TESTIMONIALS
   --------------------------------------------------------------------------
   - großes Zitat, das per Crossfade zwischen mehreren Stimmen wechselt
   - daneben ein Avatar-Stack: das aktive Portrait tritt hervor, ein Klick
     springt direkt zur jeweiligen Stimme
   - Pfeiltasten links/rechts blättern ebenfalls

   Inhalte: src/content.js  →  export const testimonials
   -------------------------------------------------------------------------- */

import { useRef, useState } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { testimonials } from "../content";
import { asset } from "../lib/asset";
import "../styles/testimonials.css";

export default function Testimonials() {
  const rootRef = useRef(null);
  const firstRunRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = testimonials.items;
  const active = items[activeIndex];

  const goTo = (index) => {
    // Modulo sorgt dafür, dass es am Ende wieder von vorne losgeht.
    setActiveIndex((index + items.length) % items.length);
  };

  /* ---- Einblenden beim Scrollen ------------------------------------------ */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        gsap.from(".testimonials__inner > *", {
          autoAlpha: 0,
          y: 34,
          stagger: 0.12,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      mm.add(MEDIA.reduceMotion, () => {
        gsap.from(".testimonials__inner", {
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

  /* ---- Crossfade beim Wechsel -------------------------------------------- */
  useGSAP(
    () => {
      if (firstRunRef.current) {
        firstRunRef.current = false;
        return;
      }

      gsap.fromTo(
        ".testimonials__quote, .testimonials__author",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" }
      );

      // Avatare: der aktive wird größer und voll deckend.
      gsap.utils.toArray(".testimonials__avatar").forEach((avatar, index) => {
        gsap.to(avatar, {
          scale: index === activeIndex ? 1 : 0.82,
          autoAlpha: index === activeIndex ? 1 : 0.45,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    },
    { scope: rootRef, dependencies: [activeIndex] }
  );

  return (
    <section className="section testimonials" id="stimmen" ref={rootRef}>
      <div className="testimonials__inner">
        <p className="eyebrow">{testimonials.eyebrow}</p>

        <div className="testimonials__body">
          {/* ---- Zitat ---------------------------------------------------- */}
          <blockquote className="testimonials__quote">
            <span className="testimonials__mark" aria-hidden="true">
              &ldquo;
            </span>
            {/* aria-live: Screenreader bekommen den Wechsel mit */}
            <p aria-live="polite">{active.quote}</p>
          </blockquote>

          {/* ---- Avatar-Stack --------------------------------------------- */}
          <div className="testimonials__avatars">
            {items.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`testimonials__avatar ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Show quote ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <img src={asset(item.avatar)} alt={item.alt} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        {/* ---- Autor + Steuerung ------------------------------------------ */}
        <div className="testimonials__footer">
          <div className="testimonials__author">
            <span className="testimonials__name">{active.name}</span>
            <span className="testimonials__role">{active.role}</span>
          </div>

          <div className="testimonials__controls">
            <button
              type="button"
              className="testimonials__arrow"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous quote"
            >
              ←
            </button>
            <span className="testimonials__counter">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="testimonials__arrow"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next quote"
            >
              →
            </button>
          </div>

          <a
            className="testimonials__more"
            href={testimonials.moreHref}
            target="_blank"
            rel="noreferrer"
          >
            {testimonials.moreLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
