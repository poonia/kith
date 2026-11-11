// Build-time Open Graph images (1200×630 PNG) with Satori → sharp.
// Satori needs TTF/OTF/WOFF (not WOFF2), so we use the static Inter files.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { SITE } from '@/consts';

const require = createRequire(import.meta.url);
const font = (weight: 400 | 600 | 700) =>
  readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all(
    ([400, 600, 700] as const).map(async (weight) => ({
      name: 'Inter',
      data: await font(weight),
      weight,
      style: 'normal' as const,
    })),
  ));

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

const C = {
  bg: '#0e0f11',
  surface: '#15171a',
  border: '#2a2e33',
  text: '#eceef1',
  muted: '#a3a8b0',
  accent: '#8ab4f8',
};

export type OgInput = {
  title: string;
  kicker?: string;
  meta?: string;
  tags?: string[];
};

export async function renderOgImage({ title, kicker, meta, tags = [] }: OgInput): Promise<Uint8Array> {
  const titleSize = title.length > 80 ? 52 : title.length > 50 ? 60 : 72;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box', // otherwise padding pushes the edges off the canvas
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      background: C.bg,
      color: C.text,
      fontFamily: 'Inter',
      borderTop: `8px solid ${C.accent}`,
    },
    [
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28, color: C.muted },
        [
          h('div', { display: 'flex', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }, SITE.title),
          kicker
            ? h(
                'div',
                {
                  display: 'flex',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: 22,
                  color: C.accent,
                },
                kicker,
              )
            : h('div', {}, ''),
        ],
      ),
      h(
        'div',
        {
          display: 'flex',
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '1000px',
        },
        title,
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, color: C.muted },
        [
          h('div', { display: 'flex', gap: '20px' }, [
            ...(meta ? [h('div', { display: 'flex' }, meta)] : []),
            ...tags.slice(0, 3).map((t) => h('div', { display: 'flex', color: C.accent }, `#${t}`)),
          ]),
          h('div', { display: 'flex' }, SITE.author),
        ],
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: await loadFonts(),
  });
  return new Uint8Array(await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer());
}

/** Public URL of an entry's OG image (keep in sync with src/pages/og/). */
export const ogImagePath = (collection: 'blog' | 'snippets' | 'pages', id: string) => `/og/${collection}/${id}.png`;
export const DEFAULT_OG_IMAGE = '/og/default.png';
