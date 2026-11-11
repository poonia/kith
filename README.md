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

## Writing cheat sheet

Everything is plain Markdown, so it works in the GitCMS editor. See `src/content/blog/kitchen-sink.md` for live examples.

| Element | Syntax |
| --- | --- |
| Code with title | ` ```js title="src/app.js" ` |
| Highlight lines / words | ` ```js {2,4-5} "word" ` |
| Inserted / deleted lines | ` ```ts ins={3} del={2} ` or ` ```diff lang="css" ` |
| Line numbers | ` ```js showLineNumbers ` |
| Collapse boilerplate | ` ```html collapse={1-4} ` |
| Terminal | ` ```bash ` / ` ```sh ` (terminal frame is automatic; omit `$` prompts) |
| Command output | ` ```text title="Output" ` |
| Diagram | ` ```mermaid title="Caption" ` — rendered to SVG at build time. Prefer `flowchart TD` for flows with more than ~4 steps; wide diagrams shrink to 75% and then scroll. |
| File tree | ` ```tree title="Caption" ` — 2-space indent or pasted `tree` output; trailing `/` = folder, `# comment`, `**highlight**`, `...` |
| Callout | `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`; add a custom title after the marker; `[!NOTE]-` starts collapsed |
| Image with caption | `![Alt text](/images/x.png "Caption")` (click-to-zoom is automatic) |
| Maths | `$inline$` and `$$ block $$` (KaTeX CSS loads only on pages that use it) |
| Icons in components | `<Icon name="folder" />` — any [Lucide](https://lucide.dev/icons) name; also usable in Mermaid as `lucide:name` |

Mermaid needs Chromium at build time: `npx playwright install chromium` (once locally; CI does it in the workflow). Rendered diagrams are cached in `node_modules/.cache/kith-mermaid`.

If a Markdown plugin changes, clear Astro's content cache: `rm -rf .astro node_modules/.astro`.

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
