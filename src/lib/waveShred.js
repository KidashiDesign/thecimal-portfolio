export const WAVE_SHRED = {
  /* ---- Idle / Always-On Noise -------------------------------------------- */
  idleJitterScale: 4,     // The max pixel displacement when NOT scrolling (keeps text readable)
  idleFlickerRate: 0.15,  // How often the background lines glitch out

  /* ---- Shred (die Verzerrung beim Scrollen) ------------------------------ */
  displacementScale: 3500,
  stretch: 10,
  snapToWave: true, 

  /* ---- Timing (SUPER FAST, NO DELAY) ------------------------------------- */
  snapSpeed: 0.9,     
  mergeSpeed: 0.9,    

  /* ---- Wellen (Canvas-Hintergrund) --------------------------------------- */
  lines: 6,
  color: "#ff3366", 
  background: "#050505", 
  waveOpacity: 0.15,
  waveAmplitude: 0.45,
  waveThickness: 1,
  waveSpread: 1,
  waveJitter: 0.25,
  waveFlare: 0.25,

  /* ---- Grenzen ----------------------------------------------------------- */
  minWidth: 768,
};

export function waveY(x, j, amp, time, height, config) {
  const a = amp * config.waveAmplitude;
  const sp = config.waveSpread;
  return (
    height / 2 +
    Math.sin(x * 0.01 + time + j) * 50 * a +
    Math.sin(x * 0.005 - time + j * 0.5) * 100 * a +
    Math.cos(x * 0.02 + time * 0.5) * 20 * a +
    (j - (config.lines - 1) / 2) * 10 * sp
  );
}

export function hexToRgba(hex, alpha) {
  const h = (hex || "#ff3366").replace("#", "");
  const f = h.length === 3 ? h.split("").map((s) => s + s).join("") : h;
  const n = parseInt(f, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}