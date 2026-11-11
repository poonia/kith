import { getCollection, type CollectionEntry } from 'astro:content';

type Name = 'blog' | 'snippets';

/** Drafts and future-dated entries show in `astro dev` but never in production builds. */
export function isPublished(entry: { data: { draft: boolean; pubDate: Date } }): boolean {
  if (import.meta.env.DEV) return true;
  return !entry.data.draft && entry.data.pubDate.getTime() <= Date.now();
}

export async function getPublished<N extends Name>(name: N): Promise<CollectionEntry<N>[]> {
  const entries = (await getCollection(name, isPublished)) as CollectionEntry<N>[];
  return entries.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
