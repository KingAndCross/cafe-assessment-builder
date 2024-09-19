import { defineConfig } from "vite";

export default defineConfig({
  base: "/cafe-assessment-builder/",
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
});
