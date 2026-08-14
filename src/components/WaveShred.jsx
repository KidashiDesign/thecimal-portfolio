import { useEffect, useRef, useState } from "react";
import { WAVE_SHRED, waveY, hexToRgba } from "../lib/waveShred";
import "../styles/waveshred.css";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

export default function WaveShred({ children, config }) {
  const canvasRef = useRef(null);
  const warpRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);

  const configRef = useRef(config);
  configRef.current = config;

  /* ---- Audio State & Synth Refs ---- */
  const [soundActive, setSoundActive] = useState(false);
  const audioRef = useRef(null);

  const handleEnableSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    // Master Output
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    // EXTREME DISTORTION (WaveShaper)
    function makeDistortionCurve(amount) {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }

    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(800); // 800 = completely crushed/clipped
    distortion.oversample = '4x';

    // Master chain: Distortion -> Gain -> Destination
    distortion.connect(masterGain);
    masterGain.connect(ctx.destination);

    // 1. Digital White Noise Generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // Pure random static
    }
    
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.5;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.value = 2; // Medium width for harsh static bursts
    
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(distortion);
    noiseSrc.start();

    // 2. Glitch Oscillator (Square wave for digital errors/beeps)
    const glitchOsc = ctx.createOscillator();
    glitchOsc.type = "square";
    
    const glitchGain = ctx.createGain();
    glitchGain.gain.value = 0; // Starts silent, spiked during glitches
    
    glitchOsc.connect(glitchGain);
    glitchGain.connect(distortion);
    glitchOsc.start();

    audioRef.current = { 
      ctx, masterGain, noiseGain, noiseFilter, glitchOsc, glitchGain 
    };
    setSoundActive(true);
    ctx.resume();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const warp = warpRef.current;
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;
    const ctx = canvas.getContext("2d");

    const cfg = { ...WAVE_SHRED, ...(configRef.current || {}) };
    const reduceQuery = window.matchMedia(REDUCE_MOTION);

    /* ---- State variables ---- */
    let width = 0;
    let height = 0;
    let time = 0;
    let warpProgress = 0;
    let mergeProgress = 0;
    let targetWarp = 0;
    let energy = 0;
    
    let els = [];
    let bounds = [];
    
    let rafId = 0;
    let lastScrollY = 0;
    let scroller = window;
    let enabled = false;

    const shredAllowed = () =>
      !reduceQuery.matches && window.innerWidth >= cfg.minWidth;

    function findScroller() {
      let n = warp && warp.parentElement;
      while (n && n !== document.body) {
        const s = getComputedStyle(n);
        if (/(auto|scroll|overlay)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 1) return n;
        n = n.parentElement;
      }
      const b = document.body, d = document.documentElement;
      if (b && b.scrollHeight > b.clientHeight + 1 && /(auto|scroll|overlay)/.test(getComputedStyle(b).overflowY)) return b;
      return d.scrollHeight > d.clientHeight + 1 ? d : window;
    }

    function scrollTop() {
      if (!scroller || scroller === window) return window.scrollY || document.documentElement.scrollTop || 0;
      return scroller.scrollTop;
    }

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function cacheBounds() {
      els = Array.from(warp.querySelectorAll("[data-warp]"));
      const prev = els.map((el) => el.style.transform);
      els.forEach((el) => { el.style.transform = "none"; });
      bounds = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + scrollTop() + r.height / 2, w: r.width, h: r.height };
      });
      els.forEach((el, i) => { el.style.transform = prev[i] || ""; });
    }

    function setEnabled(on) {
      if (on === enabled) return;
      enabled = on;
      if (!on) {
        targetWarp = 0;
        warpProgress = 0;
        mergeProgress = 0;
        displacement.setAttribute("scale", "0");
        if (warpRef.current) warpRef.current.style.transform = "translateZ(0)";
        els.forEach((el) => {
            if (el.style.transform) { el.style.transform = ""; el.style.opacity = ""; el.style.filter = ""; }
        });
      }
    }

    function drawBackground() {
      ctx.fillStyle = cfg.background;
      ctx.fillRect(0, 0, width, height);
      const e = energy;
      const amp = 1 + e * 0.55;

      for (let j = 0; j < cfg.lines; j++) {
        const hot = e * cfg.waveFlare * (0.35 + 0.65 * Math.abs(Math.sin(j * 1.7 + time * 3)));
        ctx.strokeStyle = hexToRgba(cfg.color, Math.min(1, cfg.waveOpacity + hot));
        ctx.lineWidth = cfg.waveThickness * (1 + hot * 1.2);
        
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          const jitter = e * e * Math.sin(x * 0.35 + time * 40 + j * 9) * 40 * cfg.waveJitter;
          const y = waveY(x, j, amp, time, height, cfg) + jitter;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      time += 0.01 + e * 0.05;
    }

    /* ---- Main Loop ---- */
    function loop() {
      drawBackground();

      if (enabled) {
        const currentScrollY = scrollTop();
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        targetWarp = scrollDelta > 2 ? 1 : 0;

        warpProgress += (targetWarp - warpProgress) * cfg.snapSpeed;
        mergeProgress += (warpProgress - mergeProgress) * cfg.mergeSpeed;
        
        if (warpProgress < 0.0015 && targetWarp === 0) {
            warpProgress = 0;
            mergeProgress *= 0.5; 
        }
        if (mergeProgress < 0.0015) mergeProgress = 0;
        
        energy = Math.max(warpProgress, mergeProgress);
        const p = warpProgress;
        const m = mergeProgress;

        // ---- NEW: IDLE GLITCH & NOISE LOGIC ----
        let idleScale = 0;
        let idleX = 0;
        let idleY = 0;
        
        if (p < 0.05) {
          idleScale = Math.random() * 1.5; // Constant minimal noise
          
          if (Math.random() > 0.98) { // Occasional random glitch/shake
            idleScale = Math.random() * 10;
            idleX = (Math.random() - 0.5) * 6;
            idleY = (Math.random() - 0.5) * 6;
          }
        }

        // ---- UPDATE GLITCH AUDIO ----
        if (audioRef.current) {
          const { ctx, masterGain, noiseGain, noiseFilter, glitchOsc, glitchGain } = audioRef.current;
          
          if (targetWarp === 1) {
            // Master volume is high and active
            masterGain.gain.setTargetAtTime(0.3, ctx.currentTime, 0.02);

            // 1. STUTTER EFFECT: 30% chance to rapidly cut the noise in and out (gating)
            if (Math.random() > 0.7) {
              noiseGain.gain.setValueAtTime(0, ctx.currentTime);
            } else {
              noiseGain.gain.setValueAtTime(1, ctx.currentTime);
            }

            // 2. SWEEPING NOISE: Move the noise bandpass filter violently
            if (Math.random() > 0.4) {
              noiseFilter.frequency.setValueAtTime(Math.random() * 8000 + 100, ctx.currentTime);
            }

            // 3. DIGITAL SCREAM: The square wave jumping to extreme, harsh frequencies
            if (Math.random() > 0.8) {
              // High piercing pitch
              glitchOsc.frequency.setValueAtTime(Math.random() * 5000 + 500, ctx.currentTime);
              glitchGain.gain.setValueAtTime(0.4, ctx.currentTime);
            } else {
              // Mute the square wave most of the time to make it sporadic
              glitchGain.gain.setValueAtTime(0, ctx.currentTime);
            }
          } else {
            // INSTANTLY KILL AUDIO when scroll stops
            masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
            glitchGain.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
          }
        }

        displacement.setAttribute("scale", String(p * cfg.displacementScale + idleScale));
        turbulence.setAttribute("baseFrequency", `0.001 ${(0.1 + p * 0.1).toFixed(4)}`);
        
        if (warpRef.current) {
          warpRef.current.style.transform = `translate3d(${idleX.toFixed(2)}px, ${idleY.toFixed(2)}px, 0)`;
        }

        const cx = width / 2;

        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          const b = bounds[i];
          if (!b) continue;
          
          if (p === 0 && m === 0) {
            if (el.style.transform) { el.style.transform = ""; el.style.opacity = ""; el.style.filter = ""; }
            continue;
          }
          
          const sx = b.x;
          const sy = b.y - currentScrollY;
          const pullX = (cx - sx) * 0.65;
          const destX = sx + pullX * m;
          const line = (i * 5) % cfg.lines;
          const amp = 1 + energy * 0.55;
          
          const wy = cfg.snapToWave ? waveY(destX, line, amp, time, height, cfg) : height / 2;
          const slope = cfg.snapToWave
            ? (waveY(destX + 10, line, amp, time, height, cfg) - waveY(destX - 10, line, amp, time, height, cfg)) / 20
            : 0;
          
          const rot = Math.atan(slope) * (180 / Math.PI) * m;
          const tx = pullX * m;
          const ty = (wy - sy) * m;
          const scaleX = 1 + m * cfg.stretch;
          const scaleY = 1 - m * 0.94;
          const blur = p * 3;

          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
          el.style.opacity = String(1 - m * 0.75);
          el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    function onScroll() {}

    function onResize() {
      sizeCanvas();
      cacheBounds();
      setEnabled(shredAllowed());
    }

    scroller = findScroller();
    sizeCanvas();
    cacheBounds();
    setEnabled(shredAllowed());

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (scroller && scroller !== window) scroller.addEventListener("scroll", onScroll, { passive: true });
    reduceQuery.addEventListener("change", onResize);

    requestAnimationFrame(() => cacheBounds());
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (scroller && scroller !== window) scroller.removeEventListener("scroll", onScroll);
      reduceQuery.removeEventListener("change", onResize);
      setEnabled(false);
      
      if (audioRef.current) {
        audioRef.current.ctx.close();
      }
    };
  }, []);

  return (
    <>
      {!soundActive && (
        <button
          onClick={handleEnableSound}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
            background: WAVE_SHRED.color, color: WAVE_SHRED.background, 
            border: 'none', padding: '10px 20px', borderRadius: '20px', 
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}
        >
          Enable Audio Experience
        </button>
      )}

      <svg className="wave-shred__defs" aria-hidden="true" focusable="false" style={{position: 'absolute', width: 0, height: 0}}>
        <defs>
          <filter id="wave-shred-warp" x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.001 0.15" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <canvas className="wave-shred__canvas" ref={canvasRef} aria-hidden="true" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, display: 'block'}} />
      <div className="wave-shred__warp" ref={warpRef} style={{position: 'relative', zIndex: 1, filter: 'url(#wave-shred-warp)', willChange: 'filter', transform: 'translateZ(0)'}}>
        {children}
      </div>
    </>
  );
}