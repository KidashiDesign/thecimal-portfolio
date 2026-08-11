/* --------------------------------------------------------------------------
   1. NAVIGATION
   --------------------------------------------------------------------------
   - fixierte Kopfzeile: Logo links, Links + Menü-Button rechts
   - Menü-Button öffnet ein Vollbild-Overlay
   - Das Overlay fährt per clip-path von oben auf, die Links erscheinen
     danach zeitversetzt (stagger)

   Texte/Links: src/content.js  →  export const nav
   -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../lib/motion";
import { nav } from "../content";
import { asset } from "../lib/asset";
import "../styles/nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const timelineRef = useRef(null);
  const reduced = useReducedMotion();

  /* ---- Öffnen/Schließen-Animation ----------------------------------------
     Wir bauen die Timeline EINMAL im pausierten Zustand und spielen sie
     später vorwärts/rückwärts ab. Das ist flüssiger, als bei jedem Klick
     eine neue Timeline zu erzeugen. */
  useGSAP(
    () => {
      const links = gsap.utils.toArray(".nav-overlay__link");
      const columns = gsap.utils.toArray(".nav-overlay__col");

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        // Nach dem Schließen das Overlay komplett aus dem Tab-Fluss nehmen
        onReverseComplete: () => {
          gsap.set(overlayRef.current, { visibility: "hidden" });
        },
      });

      /* Bewusst überall `fromTo` statt `from`:
         Bei `from` merkt sich GSAP den Zielwert aus dem aktuellen Zustand
         des Elements. Da diese Timeline pausiert gebaut und später auch
         rückwärts abgespielt wird, kann dieser gemerkte Wert verloren gehen —
         die Links blieben dann unsichtbar liegen. Mit `fromTo` stehen Start-
         UND Zielwert fest, damit ist das Verhalten eindeutig. */
      if (reduced) {
        // Reduzierte Bewegung: nur ein kurzes Einblenden, kein Clip-Path
        timeline.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.2, ease: "none" }
        );
      } else {
        timeline
          .fromTo(
            overlayRef.current,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }
          )
          .fromTo(
            links,
            { yPercent: 120 },
            {
              yPercent: 0,
              duration: 0.7,
              stagger: 0.06,
              ease: "power3.out",
            },
            "-=0.45"
          )
          .fromTo(
            columns,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "<0.15"
          );
      }

      timelineRef.current = timeline;
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  /* ---- Timeline an den open-State koppeln -------------------------------- */
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (open) {
      gsap.set(overlayRef.current, { visibility: "visible" });
      timeline.play();
    } else if (timeline.progress() > 0) {
      // Beim ersten Rendern steht die Timeline noch am Anfang — dann gibt es
      // nichts zurückzuspulen.
      timeline.reverse();
    }
  }, [open]);

  /* ---- Scrollen sperren, solange das Overlay offen ist -------------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---- Escape schließt das Overlay --------------------------------------- */
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* ---- Kopfzeile beim Runterscrollen abdunkeln --------------------------- */
  useGSAP(
    () => {
      gsap.to(".nav__bar", {
        backgroundColor: "rgba(10, 10, 11, 0.82)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--line)",
        duration: 0.3,
        scrollTrigger: {
          trigger: document.body,
          start: "top top-=80",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <header className="nav">
        <div className="nav__bar">
          <a className="nav__logo" href="#hero" aria-label="Back to start">
            <img src={asset(nav.logo)} alt={nav.logoAlt} width="120" height="32" />
          </a>

          <nav className="nav__inline" aria-label="Main navigation">
            {nav.inlineLinks.map((link) => (
              <a key={link.href + link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="nav-overlay"
          >
            <span className="nav__toggle-label">
              {open ? nav.closeLabel : nav.menuLabel}
            </span>
            <span className={`nav__burger ${open ? "is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* ---- Vollbild-Overlay ---------------------------------------------- */}
      <div
        id="nav-overlay"
        className="nav-overlay"
        ref={overlayRef}
        // inert hält Tastatur-Fokus draußen, solange das Overlay zu ist
        inert={!open}
      >
        <div className="nav-overlay__inner">
          <p className="eyebrow nav-overlay__eyebrow">{nav.overlay.eyebrow}</p>

          <nav className="nav-overlay__sitemap" aria-label="Sitemap">
            {nav.overlay.links.map((link) => (
              <span className="nav-overlay__link-mask" key={link.href + link.label}>
                <a
                  className="nav-overlay__link"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>

          <div className="nav-overlay__meta">
            <div className="nav-overlay__col">
              <p className="eyebrow">{nav.overlay.contactEyebrow}</p>
              <a href={`mailto:${nav.overlay.email}`}>{nav.overlay.email}</a>
              <a href={`tel:${nav.overlay.phone.replace(/\s/g, "")}`}>
                {nav.overlay.phone}
              </a>
              <address>
                {nav.overlay.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>

            <div className="nav-overlay__col">
              <p className="eyebrow">{nav.overlay.socialEyebrow}</p>
              {nav.overlay.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
