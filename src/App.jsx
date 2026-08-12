/* --------------------------------------------------------------------------
   APP — hier wird die Seite zusammengesetzt
   --------------------------------------------------------------------------
   Reihenfolge der Sektionen ändern? Einfach die Zeilen unten umsortieren.
   Sektion ganz weglassen? Zeile auskommentieren (Strg + /).

   Die `id`s der Sektionen stehen in den jeweiligen Komponenten und werden
   von den Navigations-Links in src/content.js angesprungen
   (z. B. href: "#projekte").
   -------------------------------------------------------------------------- */

import { useEffect } from "react";
import GenerativeBackground from "./components/GenerativeBackground";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Statement from "./components/Statement";
import MissionVision from "./components/MissionVision";
import Milestones from "./components/Milestones";
import Projects from "./components/Projects";
import Marquee from "./components/Marquee";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

import { useSmoothScroll } from "./lib/useSmoothScroll";
import { ScrollTrigger } from "./lib/gsap";

export default function App() {
  // Smooth Scrolling (Lenis) für die ganze Seite, gekoppelt an ScrollTrigger
  useSmoothScroll();

  /* Bilder werden nachgeladen und ändern dabei die Seitenhöhe. Danach muss
     ScrollTrigger seine Start-/Endpunkte neu vermessen, sonst passen die
     Animationen nicht mehr zur tatsächlichen Position. */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <GenerativeBackground />
      <Nav />

      <main>
        <Hero />
        <Statement />
        <MissionVision />
        <Milestones />
        <Projects />
        <Marquee />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}
