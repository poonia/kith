// Renders ```mermaid fences to inline SVG at build time (Playwright + mermaid-isomorphic).
// Each diagram is rendered twice — light and dark — and CSS shows the one matching
// the site theme (OS preference or the toggle). Readers download zero Mermaid JS.
//
//   ```mermaid title="Request flow"
//   flowchart LR
//     A --> B
//   ```
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { lucideIcons } from '../lib/icons.mjs';

const require = createRequire(import.meta.url);
const CACHE_DIR = path.resolve('node_modules/.cache/kith-mermaid');
const RENDER_VERSION = '3';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const titleFrom = (meta) => meta?.match(/title=(?:"([^"]*)"|'([^']*)')/)?.slice(1).find(Boolean);

// Render with the same font the site uses so label boxes are measured correctly.
const interFile = pathToFileURL(require.resolve('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href;
const fontCss = `@font-face{font-family:Inter;font-weight:100 900;src:url("${interFile}") format("woff2")}`;

const base = {
  fontFamily: 'Inter, system-ui, sans-serif',
  flowchart: { htmlLabels: true, curve: 'basis', padding: 12 },
  sequence: { mirrorActors: false },
};
const THEMES = {
  light: { ...base, theme: 'base', themeVariables: { fontFamily: base.fontFamily, fontSize: '15px', primaryColor: '#f5f5f3', primaryBorderColor: '#9a9a94', primaryTextColor: '#1c1c1a', lineColor: '#5e5e59', secondaryColor: '#ebebe8', tertiaryColor: '#fcfcfb', noteBkgColor: '#fdf6dc', noteBorderColor: '#d8c27a' } },
  dark: { ...base, theme: 'base', themeVariables: { darkMode: true, fontFamily: base.fontFamily, fontSize: '15px', background: '#0e0f11', primaryColor: '#1d2024', primaryBorderColor: '#6b7078', primaryTextColor: '#eceef1', lineColor: '#a3a8b0', secondaryColor: '#2a2e33', tertiaryColor: '#15171a', noteBkgColor: '#2e2a1a', noteBorderColor: '#7a6a35', noteTextColor: '#eceef1' } },
};

/** @type {import('mermaid-isomorphic').MermaidRenderer | undefined} */
let renderer;
async function getRenderer() {
  if (!renderer) {
    const { createMermaidRenderer } = await import('mermaid-isomorphic');
    renderer = createMermaidRenderer();
  }
  return renderer;
}

/** Record the natural size; CSS shrinks wide diagrams to fit, but never below 75% — past that they scroll. */
function sizeSvg(svg, width, height) {
  return svg.replace(/<svg\b([^>]*)>/, (_, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '').replace(/\sstyle="[^"]*"/, '');
    return `<svg${cleaned} width="${Math.ceil(width)}" height="${Math.ceil(height)}" style="--w:${Math.ceil(width)}px">`;
  });
}

async function renderDiagram(source) {
  const key = createHash('sha256').update(RENDER_VERSION + JSON.stringify(THEMES) + source).digest('hex').slice(0, 16);
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);
  try {
    return JSON.parse(await readFile(cacheFile, 'utf8'));
  } catch {}

  const render = await getRenderer();
  const out = {};
  for (const [mode, mermaidConfig] of Object.entries(THEMES)) {
    const [result] = await render([source], {
      mermaidConfig,
      prefix: `mmd-${key}-${mode}`,
      css: `data:text/css,${encodeURIComponent(fontCss)}`,
      iconPacks: [{ name: 'lucide', icons: lucideIcons }],
    });
    if (result.status === 'rejected') throw result.reason;
    const { svg, width, height, title, description } = result.value;
    out[mode] = { svg: sizeSvg(svg, width, height), title, description };
  }
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cacheFile, JSON.stringify(out));
  return out;
}

export function remarkMermaid() {
  /** @param {any} tree @param {any} file */
  return async (tree, file) => {
    /** @type {{parent: any, index: number, node: any}[]} */
    const found = [];
    const walk = (node) => {
      node.children?.forEach((child, index) => {
        if (child.type === 'code' && child.lang === 'mermaid') found.push({ parent: node, index, node: child });
        else walk(child);
      });
    };
    walk(tree);
    if (found.length === 0) return;

    for (const { parent, index, node } of found) {
      let rendered;
      try {
        rendered = await renderDiagram(node.value);
      } catch (error) {
        const where = `${path.relative(process.cwd(), file.path ?? 'unknown')}:${node.position?.start.line ?? '?'}`;
        throw new Error(`Mermaid diagram failed to render (${where}): ${error instanceof Error ? error.message : error}`);
      }
      const title = titleFrom(node.meta);
      const label = title ?? rendered.light.title ?? rendered.light.description ?? 'Diagram';
      const caption = title ? `<figcaption>${esc(title)}</figcaption>` : '';
      parent.children[index] = {
        type: 'html',
        value:
          `<figure class="diagram" role="img" aria-label="${esc(label)}">` +
          `<div class="diagram-light">${rendered.light.svg}</div>` +
          `<div class="diagram-dark">${rendered.dark.svg}</div>` +
          `${caption}</figure>`,
      };
    }
  };
}
