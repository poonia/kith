// Build-time Lucide icons (Iconify JSON). Used by Icon.astro and the Markdown plugins,
// so every icon ships as inline SVG with zero client JS.
import { icons as lucide } from '@iconify-json/lucide';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

export const lucideIcons = lucide;

/**
 * @param {string} name Lucide icon name, e.g. "folder"
 * @param {{ size?: number | string, class?: string, label?: string }} [opts]
 * @returns {string} SVG markup
 */
export function iconSvg(name, opts = {}) {
  const data = getIconData(lucide, name);
  if (!data) throw new Error(`Unknown Lucide icon: "${name}"`);
  const size = opts.size ?? '1em';
  const { attributes, body } = iconToSVG(data, { height: size, width: size });
  /** @type {Record<string, string>} */
  const attrs = { ...attributes, fill: 'none' };
  if (opts.class) attrs.class = opts.class;
  if (opts.label) {
    attrs.role = 'img';
    attrs['aria-label'] = opts.label;
  } else {
    attrs['aria-hidden'] = 'true';
  }
  return iconToHTML(replaceIDs(body), attrs);
}
