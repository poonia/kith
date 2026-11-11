import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  { eager: true },
);

/** Resolve a GitCMS `/images/...` path (frontmatter) to an optimisable asset. */
export function resolveImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = `/src/assets${decodeURI(path)}`;
  const mod = images[key];
  if (!mod) throw new Error(`Image not found: ${path} (expected at ${key})`);
  return mod.default;
}
