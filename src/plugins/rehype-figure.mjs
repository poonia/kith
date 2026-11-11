// `![alt](/images/x.png "Caption")` on its own line → <figure><img><figcaption>Caption</figcaption></figure>.
// Runs in rehype so Astro still optimises the <img>.
export function rehypeFigure() {
  /** @param {any} tree */
  return (tree) => {
    const walk = (node) => {
      node.children?.forEach((child, i) => {
        if (child.type === 'element' && child.tagName === 'p') {
          const elements = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
          const img = elements[0];
          if (elements.length === 1 && img.type === 'element' && img.tagName === 'img' && img.properties?.title) {
            const caption = String(img.properties.title);
            delete img.properties.title;
            node.children[i] = {
              type: 'element',
              tagName: 'figure',
              properties: {},
              children: [
                img,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [{ type: 'text', value: caption }],
                },
              ],
            };
            return;
          }
        }
        walk(child);
      });
    };
    walk(tree);
  };
}
