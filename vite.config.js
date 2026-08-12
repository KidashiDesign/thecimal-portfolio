import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Die Seite wird über Cloudflare Pages unter der Domain-Wurzel veröffentlicht,
// daher bleibt der Base-Pfad sowohl im Dev- als auch im Build-Modus "/".

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
});
