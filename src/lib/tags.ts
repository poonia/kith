import type { CollectionEntry } from 'astro:content';
import { getPublished } from './content';

export type AnyEntry = CollectionEntry<'blog'> | CollectionEntry<'snippets'>;

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const tagHref = (tag: string) => `/tags/${tagSlug(tag)}/`;
export const entryHref = (e: AnyEntry) => `/${e.collection}/${e.id}/`;

/** All published entries (blog + snippets), newest first. */
export async function getAllPublished(): Promise<AnyEntry[]> {
  const all: AnyEntry[] = [...(await getPublished('blog')), ...(await getPublished('snippets'))];
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Tags with their entries; tags differing only in case/spacing are merged. */
export async function getTags() {
  const map = new Map<string, { slug: string; name: string; entries: AnyEntry[] }>();
  for (const entry of await getAllPublished()) {
    for (const name of entry.data.tags) {
      const slug = tagSlug(name);
      if (!slug) continue;
      const t = map.get(slug) ?? { slug, name, entries: [] };
      t.entries.push(entry);
      map.set(slug, t);
    }
  }
  return [...map.values()].sort((a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name));
}
