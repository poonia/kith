---
title: Kitchen sink
description: Every content element the blog supports, used to check rendering. Draft only — never published.
pubDate: 2026-01-01T00:00:00.000Z
tags:
  - Meta
heroImage: /images/kitchen-sink/sample.png
heroAlt: Blue-purple gradient placeholder
draft: true
comments: false
---

This draft exercises every element. It only renders in `npm run dev`.

## Text

Body text with **bold**, _italic_, `inline code`, and a [link](https://astro.build).

> A blockquote for quoted material.

- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item

## Image from the GitCMS media library

![Gradient placeholder image](/images/kitchen-sink/sample.png)

## Code

```js
// Phase 2 swaps this for Expressive Code (titles, highlights, copy button).
export function greet(name) {
  return `Hello, ${name}!`;
}
```

```bash
npm create astro@latest
```

## Table

| Token       | Light     | Dark      |
| ----------- | --------- | --------- |
| `--color-bg` | `#fcfcfb` | `#0e0f11` |
| `--color-link` | `#1f5fbf` | `#8ab4f8` |

---

Phase 2 adds: Mermaid diagrams, file trees, callouts, icons, terminal frames.
