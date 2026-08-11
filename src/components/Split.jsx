/* --------------------------------------------------------------------------
   SPLIT — Text in einzeln animierbare Teile zerlegen
   --------------------------------------------------------------------------
   GSAP kann nur Elemente animieren, keinen nackten Text. Diese beiden
   Helfer bauen deshalb ein <span> pro Buchstabe bzw. pro Wort.

   Wir machen das direkt in React (statt mit dem SplitText-Plugin), weil
   React sonst beim nächsten Render die vom Plugin erzeugten Elemente
   wieder überschreiben würde.

   WICHTIG — Zeilenumbruch:
   Die Spans sind `display: inline-block`. Ein Browser darf nur an echten
   Leerzeichen ZWISCHEN zwei Elementen umbrechen. Läge das Leerzeichen im
   Span, entstünde eine einzige endlose Zeile. Die Leerzeichen stehen
   deshalb bewusst außerhalb der Spans.

   Barrierefreiheit: der komplette Originaltext steckt in aria-label, die
   Einzel-Spans sind für Screenreader ausgeblendet. Vorgelesen wird also
   ein normaler Satz, kein Buchstabensalat.
   -------------------------------------------------------------------------- */

import { Fragment } from "react";

/**
 * Ein <span class="split-char"> pro Buchstabe.
 * Wird im Hero und in der CTA-Sektion für die großen Headlines benutzt.
 */
export function SplitChars({ text, className = "" }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {Array.from(text).map((char, index) =>
        // Leerzeichen bleiben normale Textknoten — sonst kein Umbruch.
        char === " " ? (
          <Fragment key={index}> </Fragment>
        ) : (
          <span className="split-char-mask" aria-hidden="true" key={index}>
            <span className="split-char">{char}</span>
          </span>
        )
      )}
    </span>
  );
}

/**
 * Ein <span class="split-word"> pro Wort.
 * Wird in der Statement-Sektion benutzt, wo jedes Wort einzeln aufhellt.
 */
export function SplitWords({ text, className = "" }) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span className={`split ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span className="split-word" aria-hidden="true">
            {word}
          </span>
          {/* Trennendes Leerzeichen — außerhalb des Spans, siehe Hinweis oben */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
