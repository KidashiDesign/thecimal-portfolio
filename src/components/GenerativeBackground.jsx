/* --------------------------------------------------------------------------
   GENERATIVE BACKGROUND — animierte Wellenlinien, laufen dauerhaft im
   Hintergrund und werden beim Scrollen sichtbarer/intensiver.
   -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";

export default function GenerativeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, dpr;
    let time = 0;
    let rafId;

    // Scroll-Zustand: treibt Intensität, Geschwindigkeit & Sichtbarkeit
    let scrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetVelocity = 0;
    let lastScrollY = scrollY;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onScroll() {
      scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      targetVelocity = Math.min(Math.abs(scrollY - lastScrollY) / 40, 1.5);
      lastScrollY = scrollY;
      // scrollProgress currently unused directly, but kept in case of future gradient tie-in
      void docHeight;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Sanft abklingende Scroll-Geschwindigkeit -> treibt Amplitude/Speed
      scrollVelocity += (targetVelocity - scrollVelocity) * 0.08;
      targetVelocity *= 0.9;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0a0b";
      ctx.fillRect(0, 0, w, h);

      const lines = 18;
      const baseOpacity = 0.12 + scrollVelocity * 0.35;
      const ampBoost = 1 + scrollVelocity * 1.8;
      const speedBoost = 1 + scrollVelocity * 2.5;

      for (let j = 0; j < lines; j++) {
        ctx.beginPath();
        const t = j / lines;
        ctx.strokeStyle = `rgba(205, 255, 79, ${(baseOpacity * (0.4 + t * 0.6)).toFixed(3)})`;
        ctx.lineWidth = 1;

        for (let i = 0; i <= w; i += 8) {
          const y =
            h / 2 +
            Math.sin(i * 0.01 + time * speedBoost + j) * 50 * ampBoost +
            Math.sin(i * 0.005 - time * speedBoost + j * 0.5) * 100 * ampBoost +
            Math.cos(i * 0.02 + time * 0.5 * speedBoost) * 20 * ampBoost;

          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }

      time += 0.01 * speedBoost;
      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
