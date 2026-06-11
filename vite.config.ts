import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
// import { boneyardPlugin } from "boneyard-js/vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
    // boneyardPlugin(),
  ],
  // optimizeDeps: {
  //   exclude: ["gsap"],
  // },
});

export default config;
