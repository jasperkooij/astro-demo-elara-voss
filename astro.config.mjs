// @ts-check
import { defineConfig, sharpImageService } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elaravoss.dev',
  integrations: [
    sitemap({
      serialize(item) {
        const blogDates = {
          'ditching-react-for-astro': '2026-05-07',
          'design-system-that-saved-40-hours': '2026-05-07',
          'core-web-vitals-practical-guide': '2026-05-07',
        };
        const blogMatch = item.url.match(/\/blog\/([^/]+)\/$/);
        if (blogMatch && blogDates[blogMatch[1]]) {
          item.lastmod = blogDates[blogMatch[1]];
        } else {
          item.lastmod = new Date().toISOString().split('T')[0];
        }
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
