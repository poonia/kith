// Exposes per-entry flags via `remarkPluginFrontmatter` so layouts load extras
// (e.g. KaTeX CSS) only on pages that need them.
export function remarkFlags() {
  /** @param {any} tree @param {any} file */
  return (tree, file) => {
    let hasMath = false;
    const walk = (node) => {
      if (node.type === 'math' || node.type === 'inlineMath') hasMath = true;
      node.children?.forEach(walk);
    };
    walk(tree);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.hasMath = hasMath;
  };
}
