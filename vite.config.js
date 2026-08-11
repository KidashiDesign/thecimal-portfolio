import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Die Seite wird auf GitHub Pages unter einem Unterordner veröffentlicht:
   https://kidashidesign.github.io/Thecimal/
   Deshalb braucht der fertige Build den Präfix "/Thecimal/".

   Beim lokalen Entwickeln (npm run dev) bleibt es bei "/", damit die
   Adresse im Browser kurz und gewohnt bleibt.

   Umbenanntes Repository? Dann hier den Namen anpassen. */
const REPO_NAME = "Thecimal";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${REPO_NAME}/` : "/",
  plugins: [react()],
}));
