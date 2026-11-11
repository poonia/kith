// Turns a ```tree fence into an accessible, collapsible file tree.
//
// Accepts either 2-space indentation or `tree` command output:
//
//   ```tree title="Project"
//   src/
//     components/
//       Header.astro   # site header
//     **index.astro**  # highlighted
//   ...
//   ```
//
// - Trailing `/` (or having children) marks a folder.
// - `# text` adds a muted comment. `**name**` highlights an entry. `...` is a placeholder.
import { iconSvg } from '../lib/icons.mjs';

const TREE_CHARS = /[│├└─]/;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const FILE_ICONS = [
  [/\.(astro|jsx?|tsx?|mjs|cjs|vue|svelte|java|py|rb|go|rs|php|c|cpp|h)$/i, 'file-code'],
  [/\.(css|scss|less|html?)$/i, 'file-code'],
  [/\.(json|jsonc|ya?ml|toml|xml)$/i, 'file-json'],
  [/\.(md|mdx|txt|rst)$/i, 'file-text'],
  [/\.(png|jpe?g|gif|webp|avif|svg|ico)$/i, 'file-image'],
  [/\.(sh|bash|zsh|ps1)$/i, 'file-terminal'],
  [/(^\.|config|rc$|\.lock$|\.env)/i, 'file-cog'],
];
const iconFor = (name, isDir) => {
  if (isDir) return 'folder';
  for (const [re, icon] of FILE_ICONS) if (re.test(name)) return icon;
  return 'file';
};

/** @param {string} source */
export function parseTree(source) {
  const lines = source.split('\n').filter((l) => l.trim().length > 0);
  const usesTreeChars = lines.some((l) => TREE_CHARS.test(l));
  /** @type {{name: string, comment?: string, highlight: boolean, placeholder: boolean, depth: number, children: any[]}[]} */
  const root = [];
  const stack = [{ depth: -1, children: root }];

  for (const raw of lines) {
    let depth;
    let text;
    if (usesTreeChars) {
      const m = raw.match(/^([\s│├└─]*)(.*)$/);
      depth = Math.round((m?.[1] ?? '').length / 4);
      text = m?.[2] ?? raw;
    } else {
      const indent = raw.match(/^\s*/)?.[0].length ?? 0;
      depth = Math.floor(indent / 2);
      text = raw.trim();
    }
    const [rawName, ...commentParts] = text.split(/\s+#\s?/);
    let name = rawName.trim();
    const highlight = /^\*\*.+\*\*$/.test(name);
    if (highlight) name = name.slice(2, -2);
    const node = {
      name,
      comment: commentParts.join(' # ').trim() || undefined,
      highlight,
      placeholder: name === '...' || name === '…',
      depth,
      children: [],
    };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
}

function renderNodes(nodes) {
  return `<ul>${nodes.map(renderNode).join('')}</ul>`;
}

function renderNode(n) {
  if (n.placeholder) return `<li class="ft-placeholder" aria-label="more files">…</li>`;
  const isDir = n.name.endsWith('/') || n.children.length > 0;
  const label = esc(n.name.replace(/\/$/, ''));
  const cls = ['ft-name', n.highlight && 'ft-highlight'].filter(Boolean).join(' ');
  const comment = n.comment ? `<span class="ft-comment">${esc(n.comment)}</span>` : '';
  const entry = `${iconSvg(iconFor(n.name, isDir), { class: 'ft-icon' })}<span class="${cls}">${label}${isDir ? '/' : ''}</span>${comment}`;
  if (isDir && n.children.length > 0) {
    return `<li class="ft-dir"><details open><summary>${entry}</summary>${renderNodes(n.children)}</details></li>`;
  }
  return `<li class="${isDir ? 'ft-dir' : 'ft-file'}"><span class="ft-row">${entry}</span></li>`;
}

const titleFrom = (meta) =>
  meta
    ?.match(/title=(?:"([^"]*)"|'([^']*)')/)
    ?.slice(1)
    .find(Boolean);

export function remarkFileTree() {
  /** @param {any} tree */
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'tree') {
          const title = titleFrom(child.meta);
          const caption = title ? `<figcaption>${esc(title)}</figcaption>` : '';
          return {
            type: 'html',
            value: `<figure class="file-tree" aria-label="${esc(title ?? 'File tree')}">${caption}${renderNodes(parseTree(child.value))}</figure>`,
          };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
