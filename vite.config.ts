// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Base path for all emitted asset URLs.
//
// Default "/" (root-absolute) is correct for Lovable hosting and for a VM that
// serves the app at the domain root. When a reverse proxy / Cisco ZTA tunnel
// exposes the app under a sub-path (e.g. https://gw.example.com/catalytic/),
// root-absolute URLs resolve to the gateway root and 404 — the page loads its
// HTML but never hydrates (endless spinner). Build with:
//   APP_BASE_PATH=/catalytic/ bun run build
// so every CSS/JS URL is emitted with that prefix.
const rawBase = process.env.APP_BASE_PATH?.trim();
const basePath = rawBase && rawBase !== "/" ? `/${rawBase.replace(/^\/+|\/+$/g, "")}/` : "/";

export default defineConfig({
  // Force consistent, root-absolute asset URLs so hashed CSS/JS emitted into
  // /assets/ are always referenced as /assets/... — this keeps the app working
  // behind reverse proxies / ZTA tunnels where relative paths resolve wrongly.
  vite: {
    base: basePath,
    build: {
      assetsDir: "assets",
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Default (unset) keeps Lovable's normal deploy target. Self-hosting (e.g. Docker on a
  // Linux VM) sets NITRO_PRESET=node-server to emit a standalone Node server build in
  // .output (entry: .output/server/index.mjs).
  ...(process.env.NITRO_PRESET
    ? {
        nitro: {
          preset: process.env.NITRO_PRESET,
          output: {
            dir: ".output",
            serverDir: ".output/server",
            publicDir: ".output/public",
          },
        },
      }
    : {}),
});
