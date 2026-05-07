import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: 'Elara Voss — Blog',
    description:
      'Technical writing on web performance, design systems, Astro, React, TypeScript, and frontend engineering.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.description,
      link: `/blog/${p.id}/`,
      author: p.data.author,
      categories: p.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
