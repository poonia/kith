// GitCMS stores uploads in src/assets/images and writes root-relative
// references such as `/images/2026/diagram.png`. Astro only optimises images
// referenced by a path relative to the Markdown file, so rewrite them here.
import path from 'node:path';

const PREFIX = '/images/';

/** @returns {(tree: any, file: any) => void} */
export function remarkImagePaths() {
  return (tree, file) => {
    const filePath = file.path ?? file.history?.[0];
    if (!filePath) return;
    const imagesDir = path.join(file.cwd ?? process.cwd(), 'src/assets/images');
    const fromDir = path.dirname(filePath);

    /** @param {any} node */
    const walk = (node) => {
      if ((node.type === 'image' || node.type === 'definition') && typeof node.url === 'string' && node.url.startsWith(PREFIX)) {
        const target = path.join(imagesDir, decodeURI(node.url.slice(PREFIX.length)));
        let rel = path.relative(fromDir, target).split(path.sep).join('/');
        if (!rel.startsWith('.')) rel = `./${rel}`;
        node.url = rel;
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(tree);
  };
}
