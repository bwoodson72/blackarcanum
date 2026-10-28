// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { configuredSiteUrl, isIndexableBuiltPage } from './src/lib/seo-config.mjs';
import vercel from '@astrojs/vercel';

// Keep the Vercel adapter for future on-demand routes while allowing
// approved editorial routes to remain prerendered as static HTML.
const site = configuredSiteUrl();

export default defineConfig({
  ...(site ? { site } : {}),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    svelte(),
    mdx(),
    ...(site ? [sitemap({
      // Filter actual generated, indexable HTML: no preview/draft leaks.
      filter: (url) => isIndexableBuiltPage(url),
    })] : []),
  ],
  adapter: vercel(),
});
