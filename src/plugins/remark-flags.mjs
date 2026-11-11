// Exposes per-entry data via `remarkPluginFrontmatter`:
// - hasMath: load KaTeX CSS only where needed
// - readingTime: minutes, prose at 220 wpm; code counts half (readers skim it)
const WPM = 220;
const words = (s) => (s.match(/\S+/g) ?? []).length;

export function remarkFlags() {
  /** @param {any} tree @param {any} file */
  return (tree, file) => {
    let hasMath = false;
    let prose = 0;
    let code = 0;
    const walk = (node) => {
      if (node.type === 'math' || node.type === 'inlineMath') hasMath = true;
      if (node.type === 'text' || node.type === 'inlineCode') prose += words(node.value);
      else if (node.type === 'code') code += words(node.value);
      node.children?.forEach(walk);
    };
    walk(tree);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.hasMath = hasMath;
    file.data.astro.frontmatter.readingTime = Math.max(1, Math.round((prose + code / 2) / WPM));
  };
}
