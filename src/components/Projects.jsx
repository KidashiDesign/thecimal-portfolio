/* --------------------------------------------------------------------------
   6. PROJEKTE — Tabs mit Crossfade
   --------------------------------------------------------------------------
   - eine Tab-Leiste pro Projekt, der aktive Tab ist farblich hervorgehoben
   - beim Wechsel blenden Bild und Meta-Infos weich ineinander über
   - darunter ein Thumbnail-Strip; Hover zoomt das Vorschaubild leicht an

   Inhalte: src/content.js  →  export const projects
   (Ein Projekt hinzufügen = ein weiteres Objekt in `projects.items`.)
   -------------------------------------------------------------------------- */

import { useRef, useState } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { projects } from "../content";
import { asset } from "../lib/asset";
import "../styles/projects.css";

/* Meta-Zeilen (Ort, Jahr, Kategorie, Rolle, Medium, Tools) eines Projekts.
   Felder ohne Inhalt fallen raus — Beschriftungen kommen aus content.js. */
function metaFor(item) {
  const labels = projects.metaLabels;

  return [
    { label: labels.client, value: item.client },
    { label: labels.year, value: item.year },
    { label: labels.type, value: item.type },
    { label: labels.role, value: item.role },
    { label: labels.medium, value: item.medium },
    { label: labels.tools, value: (item.tools || []).join(", ") },
  ].filter((entry) => entry.value);
}

export default function Projects() {
  const rootRef = useRef(null);
  const firstRunRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = projects.items[activeIndex];

  /* ---- Einblenden beim Scrollen ------------------------------------------ */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        gsap.from(".projects__head > *, .projects__tabs", {
          autoAlpha: 0,
          y: 28,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".projects__head",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".projects__stage", {
          autoAlpha: 0,
          y: 48,
          duration: 1.1,
          scrollTrigger: { trigger: ".projects__stage", start: "top 85%" },
        });

        gsap.from(".projects__thumb", {
          autoAlpha: 0,
          y: 20,
          stagger: 0.07,
          scrollTrigger: { trigger: ".projects__strip", start: "top 90%" },
        });
      });

      mm.add(MEDIA.reduceMotion, () => {
        gsap.from(".projects__inner", {
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

  /* ---- Crossfade beim Tab-Wechsel ---------------------------------------- */
  useGSAP(
    () => {
      const duration = firstRunRef.current ? 0 : 0.6;
      firstRunRef.current = false;

      // Bilder liegen übereinander — nur das aktive ist sichtbar.
      gsap.utils.toArray(".projects__slide").forEach((slide, index) => {
        const isActive = index === activeIndex;
        gsap.to(slide, {
          autoAlpha: isActive ? 1 : 0,
          scale: isActive ? 1 : 1.04,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      if (!duration) return;

      // Meta-Infos (Client, Jahr, Typ) kommen zeilenweise nach.
      gsap.fromTo(
        ".projects__meta-item, .projects__description, .projects__link",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
      );
    },
    { scope: rootRef, dependencies: [activeIndex] }
  );

  return (
    <section className="section projects" id="projekte" ref={rootRef}>
      <div className="projects__inner">
        <div className="projects__head" data-warp>
          <p className="eyebrow">{projects.eyebrow}</p>
          <h2 className="headline">{projects.headline}</h2>
        </div>

        {/* ---- Tab-Leiste --------------------------------------------------- */}
        <div className="projects__tabs" role="tablist" aria-label={projects.headline}>
          {projects.items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`project-tab-${item.id}`}
              aria-selected={index === activeIndex}
              aria-controls="project-panel"
              className={`projects__tab ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="projects__tab-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.tabLabel}
            </button>
          ))}
        </div>

        {/* ---- Bühne: Bild + Meta ------------------------------------------ */}
        <div className="projects__stage" id="project-panel" role="tabpanel"
             aria-labelledby={`project-tab-${active.id}`}>
          <div className="projects__slides" data-warp>
            {projects.items.map((item, index) => (
              <figure
                className={`projects__slide ${index === activeIndex ? "is-active" : ""}`}
                key={item.id}
              >
                <img src={asset(item.image)} alt={item.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>

          <div className="projects__info" data-warp>
            {/* Leere Felder (z. B. unbekanntes Jahr) werden übersprungen,
                statt eine Zeile ohne Wert zu rendern. */}
            <dl className="projects__meta">
              {metaFor(active).map(({ label, value }) => (
                <div className="projects__meta-item" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <p className="projects__description">{active.description}</p>

            {/* Link nur, wenn eine URL hinterlegt ist */}
            {active.href ? (
              <a
                className="projects__link"
                href={active.href}
                target="_blank"
                rel="noreferrer"
              >
                {active.linkLabel || projects.linkLabel}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* ---- Thumbnail-Strip --------------------------------------------- */}
        <div className="projects__strip" data-warp>
          {projects.items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`projects__thumb ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.tabLabel}`}
            >
              <img src={asset(item.thumb)} alt="" loading="lazy" decoding="async" />
              <span className="projects__thumb-label">{item.tabLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
