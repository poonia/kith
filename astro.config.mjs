// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import expressiveCode from 'astro-expressive-code';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';
import { remarkImagePaths } from './src/plugins/remark-image-paths.mjs';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';
import { remarkFileTree } from './src/plugins/remark-file-tree.mjs';
import { remarkFlags } from './src/plugins/remark-flags.mjs';
import { rehypeFigure } from './src/plugins/rehype-figure.mjs';
import { rehypeHeadingAnchors } from './src/plugins/rehype-heading-anchors.mjs';
import { iconSvg } from './src/lib/icons.mjs';

/** @param {string} name */
const calloutIcon = (name) => iconSvg(name, { size: 18 });

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://kith.dev',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Must come before other integrations that touch Markdown. Options live in ec.config.mjs.
  integrations: [
    expressiveCode(),
    sitemap({
      // Feeds, OG images and the 404 page don't belong in the sitemap.
      filter: (page) => !/\/(404|og)\//.test(page) && !page.endsWith('/404/'),
    }),
  ],

  // Self-hosted variable fonts (latin), served from our own origin — no third-party requests.
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-sans',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
          {
            src: ['@fontsource-variable/inter/files/inter-latin-wght-italic.woff2'],
            weight: '100 900',
            style: 'italic',
          },
        ],
      },
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  markdown: {
    // Remark/rehype (unified) pipeline. Order matters: Mermaid and file trees are
    // converted before Expressive Code (added by the integration) sees code fences.
    processor: unified({
      remarkPlugins: [
        // GitCMS writes `/images/…` paths; map them to src/assets/images so Astro optimises them.
        remarkImagePaths,
        remarkMermaid,
        remarkFileTree,
        remarkMath,
        remarkFlags,
      ],
      rehypePlugins: [
        rehypeHeadingIds,
        rehypeHeadingAnchors,
        rehypeFigure,
        [rehypeKatex, { output: 'html', strict: false }],
        [
          rehypeCallouts,
          {
            theme: 'github',
            callouts: {
              note: { indicator: calloutIcon('info') },
              tip: { indicator: calloutIcon('lightbulb') },
              important: { indicator: calloutIcon('message-square-warning') },
              warning: { indicator: calloutIcon('triangle-alert') },
              caution: { indicator: calloutIcon('octagon-alert') },
            },
          },
        ],
      ],
    }),
  },
});
