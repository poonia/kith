# kith.dev

Personal blog built with [Astro](https://astro.build), content managed with [GitCMS](https://gitcms.dev), hosted on GitHub Pages.

## Requirements

- Node 24 (`nvm use` reads `.nvmrc`; Astro 7 needs Node ≥ 22.23.4)

## Commands

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Install dependencies                               |
| `npm run dev`     | Dev server at http://localhost:4321 (shows drafts) |
| `npm run build`   | Type-check, then build to `dist/` (no drafts)      |
| `npm run preview` | Serve the production build locally                 |

## Content

| Collection | Folder                  | Notes                         |
| ---------- | ----------------------- | ----------------------------- |
| Blog       | `src/content/blog/`     | Long-form articles            |
| Snippets   | `src/content/snippets/` | Short notes, TILs, code       |

- Files starting with `_` are ignored.
- `draft: true` or a future `pubDate` → visible in `npm run dev`, excluded from production builds.
- Frontmatter is validated at build time by `src/content.config.ts`. Keep it in sync with `.gitcms/sites/kith/collections/*.jsonc`.
- `src/content/blog/kitchen-sink.md` is a permanent draft that uses every supported element — check it after styling changes.

## Images

Upload through GitCMS (or drop files into `src/assets/images/`) and reference them as `/images/<path>`:

```md
![Alt text](/images/2026/diagram.png)
```

A remark plugin (`src/plugins/remark-image-paths.mjs`) maps `/images/…` to `src/assets/images/…` so Astro optimises every image (AVIF/WebP, responsive sizes, no layout shift). `heroImage` in frontmatter uses the same path format.

## Project structure

```text
.gitcms/                GitCMS config (collections, media)
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
