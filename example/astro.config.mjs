import { defineConfig } from "astro/config";

// GitHub Pages serves the project at https://rgglez.github.io/astro-i18n-gettext/
const base = "/astro-i18n-gettext";

export default defineConfig({
  site: "https://rgglez.github.io",
  base,
  // Astro does not prefix redirect destinations with base.
  redirects: { "/": `${base}/en/` },
});
