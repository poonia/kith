import { SITE } from '@/consts';

export const absolute = (path: string, site: URL | undefined) => new URL(path, site ?? 'https://kith.dev').href;

export const personLd = (site: URL | undefined) => ({
  '@type': 'Person',
  name: SITE.author,
  url: absolute('/', site),
  sameAs: [SITE.github],
});

/** Serialise JSON-LD safely for inline <script> (no `</script>` breakouts). */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
