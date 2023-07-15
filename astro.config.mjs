import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import oneDarkPro from './src/utils/shiki-theme/one-dark-pro.json';

import remarkToc from 'remark-toc';
import remarkPrism from 'remark-prism';
import { remarkReadingTime } from "./src/utils/readingTime";
import a11yEmoji from '@fec/remark-a11y-emoji';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';


// https://astro.build/config
export default defineConfig({
  site: 'https://kith.dev',
  integrations: [
      mdx(),
      sitemap(),
      tailwind({
        config: {
          applyBaseStyles: false
        }
      })
  ],
  markdown:{
      syntaxHighlight: 'prism',
      // shikiConfig: {
      //     theme: oneDarkPro,
      //     wrap: true,
      // },
      extendDefaultPlugins: true,
      remarkPlugins: [remarkReadingTime,remarkToc,a11yEmoji,remarkPrism],
      rehypePlugins: [
        rehypeHeadingIds
      ],
  }
});