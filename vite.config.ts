import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative, so the build works on GitHub Pages
// (project sites are served from /<repo-name>/) without hardcoding the repo.
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: { environment: "node" },
});
