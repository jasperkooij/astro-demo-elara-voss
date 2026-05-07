// @ts-check
import { defineConfig, sharpImageService } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elaravoss.dev',
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  image: {
    service: sharpImageService(),
  },
  prefetch: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
