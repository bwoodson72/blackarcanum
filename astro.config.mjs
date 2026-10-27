// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';

// Static Astro output needs no adapter for Vercel.
// Reevaluate an adapter when implementing on-demand routes (e.g. Kit or commerce).
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), mdx()],
});
