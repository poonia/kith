export const SITE = {
  title: 'kith.dev',
  description: 'Notes on frontend architecture, design systems and AEM.',
  author: 'Praveen Poonia',
  lang: 'en',
  locale: 'en-US',
  github: 'https://github.com/poonia',
  /** Optional, e.g. '@handle' — adds twitter:creator. */
  twitter: '',
} as const;

/** Main navigation. Entries from the `pages` collection are only shown once published. */
export const NAV = [
  { href: '/blog/', label: 'Blog' },
  { href: '/snippets/', label: 'Snippets' },
  { href: '/about/', label: 'About', page: 'about' },
] as const;

/**
 * Comments via giscus (GitHub Discussions). Comments stay hidden until both ids are set.
 * Setup: enable Discussions on the repo, install https://github.com/apps/giscus,
 * then copy the ids from https://giscus.app.
 */
export const GISCUS = {
  repo: 'poonia/kith',
  repoId: '',
  category: 'Comments',
  categoryId: '',
} as const;

/**
 * Cloudflare Web Analytics (cookie-free, no banner needed). Added to production
 * builds only, once a token is set. Get it from Cloudflare dashboard → Analytics
 * & Logs → Web Analytics → Add a site (choose the manual JS snippet).
 */
export const CF_ANALYTICS_TOKEN = '';
