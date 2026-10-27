import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";

import vercel from "@astrojs/vercel";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
    },

  integrations: [svelte(), mdx()],
  adapter: vercel(),
});