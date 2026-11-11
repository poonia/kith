# kith.dev

Personal blog built with [Astro](https://astro.build), content managed with [GitCMS](https://gitcms.dev), hosted on GitHub Pages.

## Requirements

- Node 24 (`nvm use` reads `.nvmrc`; Astro 7 needs Node ≥ 22.23.4)

## Commands

| Command           | What it does                                               |
| ----------------- | ---------------------------------------------------------- |
| `npm install`     | Install dependencies                                       |
| `npm run dev`     | Dev server at http://localhost:4321 (shows drafts)         |
| `npm run build`   | Type-check, build to `dist/` (no drafts), index search     |
| `npm run preview` | Serve the production build locally (search works here)     |
| `npm run lint`    | Prettier check, content lint (markdownlint), `astro check` |
| `npm run format`  | Format code with Prettier                                  |

## Content

| Collection | Folder                  | Notes                                     |
| ---------- | ----------------------- | ----------------------------------------- |
| Blog       | `src/content/blog/`     | Long-form articles                        |
| Snippets   | `src/content/snippets/` | Short notes, TILs, code                   |
| Pages      | `src/content/pages/`    | About, Now, Uses — `about.md` → `/about/` |

- Files starting with `_` are ignored.
- `draft: true` or a future `pubDate` → visible in `npm run dev`, excluded from production builds.
- Frontmatter is validated at build time by `src/content.config.ts`. Keep it in sync with `.gitcms/sites/kith/collections/*.jsonc`.
- About / Now / Uses start as drafts with placeholder text. Their header/footer links appear once published.
- `src/content/blog/kitchen-sink.md` is a permanent draft that uses every supported element — check it after styling changes.

## Writing cheat sheet

Everything is plain Markdown, so it works in the GitCMS editor. See `src/content/blog/kitchen-sink.md` for live examples.

| Element                  | Syntax                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code with title          | ` ```js title="src/app.js" `                                                                                                                                          |
| Highlight lines / words  | ` ```js {2,4-5} "word" `                                                                                                                                              |
| Inserted / deleted lines | ` ```ts ins={3} del={2} ` or ` ```diff lang="css" `                                                                                                                   |
| Line numbers             | ` ```js showLineNumbers `                                                                                                                                             |
| Collapse boilerplate     | ` ```html collapse={1-4} `                                                                                                                                            |
| Terminal                 | ` ```bash ` / ` ```sh ` (terminal frame is automatic; omit `$` prompts)                                                                                               |
| Command output           | ` ```text title="Output" `                                                                                                                                            |
| Diagram                  | ` ```mermaid title="Caption" ` — rendered to SVG at build time. Prefer `flowchart TD` for flows with more than ~4 steps; wide diagrams shrink to 75% and then scroll. |
| File tree                | ` ```tree title="Caption" ` — 2-space indent or pasted `tree` output; trailing `/` = folder, `# comment`, `**highlight**`, `...`                                      |
| Callout                  | `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`; add a custom title after the marker; `[!NOTE]-` starts collapsed                                   |
| Image with caption       | `![Alt text](/images/x.png "Caption")` (click-to-zoom is automatic)                                                                                                   |
| Maths                    | `$inline$` and `$$ block $$` (KaTeX CSS loads only on pages that use it)                                                                                              |
| Icons in components      | `<Icon name="folder" />` — any [Lucide](https://lucide.dev/icons) name; also usable in Mermaid as `lucide:name`                                                       |

Mermaid needs Chromium at build time: `npx playwright install chromium` (once locally; CI does it in the workflow). Rendered diagrams are cached in `node_modules/.cache/kith-mermaid`.

If a Markdown plugin changes, clear Astro's content cache: `rm -rf .astro node_modules/.astro`.

## Reader features

- **Search** — [Pagefind](https://pagefind.app) indexes the built site after `astro build` (`⌘K`, `Ctrl K` or `/`). Only post, snippet and page bodies are indexed; mark anything else with `data-pagefind-ignore`. Not available in `npm run dev`.
- **Table of contents** — h2/h3 headings; sticky sidebar on wide screens, collapsible block on small ones. Shown when a post has 2+ headings.
- **Reading time, heading anchors, previous/next, tag pages, year-grouped archive** — automatic.
- **Comments** — [giscus](https://giscus.app) (GitHub Discussions), lazy-loaded and synced with the theme. Off until configured:
  1. Enable Discussions on the repo and create a `Comments` category (Announcement type).
  2. Install the [giscus app](https://github.com/apps/giscus) on the repo.
  3. Copy `repoId` and `categoryId` from giscus.app into `GISCUS` in `src/consts.ts`.
     Per post, `comments: false` turns them off.

## SEO and feeds

All generated at build time — nothing to maintain per post:

- **Meta**: title, description, canonical (override with `canonical` for cross-posts), Open Graph, Twitter card, `article:*` tags. Set `SITE.twitter` in `src/consts.ts` to add `twitter:creator`.
- **Social images**: a 1200×630 PNG per post, snippet and page at `/og/<collection>/<id>.png` (`src/lib/og.ts`, Satori + sharp); `/og/default.png` for everything else.
- **Structured data**: `BlogPosting` on posts and snippets, `WebSite` + `Person` on the home page, `ProfilePage` on About.
- **Feeds**: `/rss.xml` (blog) and `/snippets/rss.xml` — summary feeds (title, description, link).
- **Sitemap** `/sitemap-index.xml` (drafts, 404 and OG images excluded) and **`/robots.txt`**.

## Images

Upload through GitCMS (or drop files into `src/assets/images/`) and reference them as `/images/<path>`:

```md
![Alt text](/images/2026/diagram.png)
```

A remark plugin (`src/plugins/remark-image-paths.mjs`) maps `/images/…` to `src/assets/images/…` so Astro optimises every image (AVIF/WebP, responsive sizes, no layout shift). `heroImage` in frontmatter uses the same path format.

## Deployment

### Workflows

| Workflow                       | Runs on                                           | Does                                                                                                                             |
| ------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/deploy.yml` | push to `main`, daily 05:00 UTC, manual           | Build and deploy to GitHub Pages. The daily run publishes posts whose `pubDate` has arrived.                                     |
| `.github/workflows/ci.yml`     | every PR (including GitCMS editorial PRs), weekly | Prettier, markdownlint, build, internal link check (weekly: external links too), Lighthouse budgets, optional Cloudflare preview |

Lighthouse budgets (`lighthouserc.json`): accessibility ≥ 0.95, SEO ≥ 0.95, best practices ≥ 0.9 fail the PR; performance < 0.9 warns.

### One-time setup

1. **Repository** — must be public for GitHub Pages on a free plan (or use GitHub Pro/Team).
2. **Pages source** — _Settings → Pages → Build and deployment → Source: GitHub Actions_.
3. **Custom domain** — _Settings → Pages → Custom domain_: `kith.dev` (also in `public/CNAME`).
4. **Verify the domain** — _your account Settings → Pages → Add a domain_ (adds a TXT record), so nobody else can claim `kith.dev` on GitHub Pages.
5. **DNS at your registrar**:

   | Type  | Name  | Value                 |
   | ----- | ----- | --------------------- |
   | A     | `@`   | `185.199.108.153`     |
   | A     | `@`   | `185.199.109.153`     |
   | A     | `@`   | `185.199.110.153`     |
   | A     | `@`   | `185.199.111.153`     |
   | AAAA  | `@`   | `2606:50c0:8000::153` |
   | AAAA  | `@`   | `2606:50c0:8001::153` |
   | AAAA  | `@`   | `2606:50c0:8002::153` |
   | AAAA  | `@`   | `2606:50c0:8003::153` |
   | CNAME | `www` | `poonia.github.io`    |

   Remove any other A/AAAA/ALIAS records on `@` (e.g. registrar parking).

6. **HTTPS** — `.dev` is HSTS-preloaded, so the site won't load over HTTP at all. Wait for GitHub to issue the certificate (minutes to a few hours after DNS resolves), then tick _Enforce HTTPS_.

### Optional services

- **PR previews (Cloudflare Pages)** — create a Pages project named `kith` (_Workers & Pages → Create → Pages → Direct upload_), then in GitHub _Settings → Secrets and variables → Actions_ add secret `CLOUDFLARE_API_TOKEN` (token with _Cloudflare Pages: Edit_) and variable `CLOUDFLARE_ACCOUNT_ID` (and `CLOUDFLARE_PAGES_PROJECT` if the name differs). PRs then get a "View deployment" link. Production stays on GitHub Pages.
- **Analytics (Cloudflare Web Analytics)** — cookie-free, no consent banner. Add the site in Cloudflare → _Web Analytics_ (manual JS snippet) and paste the token into `CF_ANALYTICS_TOKEN` in `src/consts.ts`. Loaded on production builds only.
- **Comments (giscus)** — see _Reader features_ above.

## Project structure

```text
.gitcms/                GitCMS config (collections, media)
.github/workflows/      Deploy and CI workflows
public/                 Static files copied as-is (favicon, CNAME)
src/
  assets/images/        Images managed by GitCMS
  components/           UI components
  content/              Markdown content (blog, snippets)
  layouts/              Page layouts
  lib/                  Content, image and formatting helpers
  pages/                Routes
  plugins/              Remark/rehype plugins
  styles/               Design tokens, global and prose CSS
  content.config.ts     Collection schemas
astro.config.mjs
```
