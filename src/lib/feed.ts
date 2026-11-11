import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/consts';
import { getPublished } from '@/lib/content';

/** Summary feed (title + description + link). Full HTML is skipped: optimised
 *  images and code-block styling don't survive in feed readers. */
export async function feed(context: APIContext, collection: 'blog' | 'snippets') {
  const entries = await getPublished(collection);
  const label = collection === 'blog' ? 'Blog' : 'Snippets';
  const site = context.site ?? new URL('https://kith.dev');
  const self = new URL(collection === 'blog' ? '/rss.xml' : '/snippets/rss.xml', site).href;
  return rss({
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    title: `${SITE.title} — ${label}`,
    description: collection === 'blog' ? SITE.description : 'Short notes, TILs and reusable code.',
    site,
    trailingSlash: true,
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.pubDate,
      link: `/${collection}/${e.id}/`,
      categories: e.data.tags,
      // RSS <author> must be an email address; dc:creator takes a name.
      customData: `<dc:creator>${SITE.author}</dc:creator>`,
    })),
    customData: `<language>${SITE.locale.toLowerCase()}</language><atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
  });
}
