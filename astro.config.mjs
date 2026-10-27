// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

// Keep the Vercel adapter for future on-demand routes while allowing
// approved editorial routes to remain prerendered as static HTML.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), mdx()],
  adapter: vercel(),
});
