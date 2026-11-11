// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkImagePaths } from './src/plugins/remark-image-paths.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://kith.dev',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Self-hosted variable fonts (latin), served from our own origin — no third-party requests.
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-sans',
      provider: fontProviders.local(),
      options: {
        variants: [
          { src: ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'], weight: '100 900', style: 'normal' },
          { src: ['@fontsource-variable/inter/files/inter-latin-wght-italic.woff2'], weight: '100 900', style: 'italic' },
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
          { src: ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'], weight: '100 800', style: 'normal' },
        ],
      },
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  markdown: {
    // The unified (remark/rehype) processor, for the plugin ecosystem Phase 2 needs.
    processor: unified({
      // GitCMS writes `/images/…` paths; map them to src/assets/images so Astro optimises them.
      remarkPlugins: [remarkImagePaths],
    }),
    // Temporary until Expressive Code lands in Phase 2.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
});
