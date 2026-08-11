/* --------------------------------------------------------------------------
   10. FOOTER
   --------------------------------------------------------------------------
   Logo, mehrspaltige Navigation, Social-Links, Copyright.

   Inhalte: src/content.js  →  export const footer
   (Eine Spalte hinzufügen = ein weiteres Objekt in `footer.columns`.)
   -------------------------------------------------------------------------- */

import { useRef } from "react";
import { gsap, useGSAP, MEDIA } from "../lib/gsap";
import { footer } from "../content";
import "../styles/footer.css";

export default function Footer() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.fullMotion, () => {
        gsap.from(".footer__brand, .footer__col, .footer__bottom", {
          autoAlpha: 0,
          y: 26,
          stagger: 0.09,
          scrollTrigger: { trigger: rootRef.current, start: "top 92%" },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <footer className="footer" ref={rootRef}>
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={footer.logo} alt={footer.logoAlt} width="120" height="32" />
          <p className="footer__blurb">{footer.blurb}</p>

          <ul className="footer__socials">
            {footer.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__nav" aria-label="Footer-Navigation">
          {footer.columns.map((column) => (
            <div className="footer__col" key={column.title}>
              <h3 className="footer__col-title">{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label + link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer__bottom">
        <p>{footer.copyright}</p>
        <ul className="footer__legal">
          {footer.legalLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
