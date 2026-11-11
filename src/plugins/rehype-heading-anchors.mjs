// Adds a "link to this section" anchor after h2–h4 headings.
// The anchor sits beside the heading (not inside it) so the heading's accessible
// name and the TOC text stay clean. Requires ids → run after rehypeHeadingIds.
import { iconSvg } from '../lib/icons.mjs';

const LEVELS = new Set(['h2', 'h3', 'h4']);
const ICON = iconSvg('link', { size: 16 });

const textOf = (node) =>
  node.type === 'text' ? node.value : Array.isArray(node.children) ? node.children.map(textOf).join('') : '';

export function rehypeHeadingAnchors() {
  /** @param {any} tree */
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      node.children = node.children.flatMap((child) => {
        if (child.type === 'element' && LEVELS.has(child.tagName) && child.properties?.id && child.properties.id !== 'footnote-label') {
          const id = String(child.properties.id);
          const label = textOf(child).trim();
          return [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['heading-wrapper', `level-${child.tagName}`] },
              children: [
                child,
                {
                  type: 'element',
                  tagName: 'a',
                  properties: { className: ['heading-anchor'], href: `#${id}`, dataPagefindIgnore: '' },
                  children: [
                    { type: 'raw', value: ICON },
                    { type: 'element', tagName: 'span', properties: { className: ['sr-only'] }, children: [{ type: 'text', value: `Section titled “${label}”` }] },
                  ],
                },
              ],
            },
          ];
        }
        walk(child);
        return [child];
      });
    };
    walk(tree);
  };
}
