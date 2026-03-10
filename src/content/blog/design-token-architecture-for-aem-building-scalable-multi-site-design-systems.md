---
description: Learn how to architect design tokens for enterprise AEM projects. A practical guide to building scalable multi-site design systems using tokens, clientlibs, and component-driven UI architecture.
body: Learn how to architect design tokens for enterprise AEM projects. A practical guide to building scalable multi-site design systems using tokens, clientlibs, and component-driven UI architecture.
title: 'Design Token Architecture for AEM: Building Scalable Multi-Site Design Systems'
tags:
  - AEM
  - Frontend
---

> **“Design is not just what it looks like and feels like. Design is how it works.”**
— Steve Jobs

*A practical guide from an enterprise AEM implementation*

When working on large **multi-site AEM platforms**, one of the biggest challenges is maintaining **visual consistency, scalability, and maintainability** across dozens of brands, templates, and components.

In many enterprise projects I’ve worked on, the turning point for scaling a design system successfully was introducing a **Design Token Architecture**.

Without tokens:

- CSS variables become inconsistent
- Design decisions get duplicated
- Brand updates become painful
- Multi-site theming becomes fragile
With tokens:

- Design decisions become
- UI components become
- Multi-brand theming becomes manageable
- Designers and developers speak the
This article explains:

- What
- How to
- How to
- How to
- How to
Everything here comes from lessons learned while building **enterprise multi-site AEM platforms with Web Components and design systems**.

---

Design tokens are **the smallest units of design decisions**.

Instead of writing raw values like:

```javascript
color: #0055ff;
padding: 16px;
font-size: 14px;

```
We define **semantic variables** that represent design meaning.

```javascript
color: var(--color-primary);
padding: var(--space-md);
font-size: var(--font-body);

```
These tokens represent:

| Token Type | Example |
| --- | --- |
| Color | primary, secondary |
| Spacing | sm, md, lg |
| Typography | body, heading |
| Border Radius | sm, md |
| Elevation | shadow levels |
| Breakpoints | mobile, tablet |

Tokens **decouple design decisions from implementation**.

---

AEM projects often have:

- Multiple sites
- Multiple brands
- Shared component libraries
- Long-term maintenance
Without tokens, components become **hardcoded and unscalable**.

### Example Problem

Imagine 50 components using:

```javascript
#0055ff

```
Now brand changes to:

```javascript
#0066cc

```
You must update **50+ components**.

With tokens:

```javascript
--color-primary

```
You change it **once**.

---

In enterprise AEM projects, tokens should follow **a layered architecture**.

### Token Layering Model

```javascript
Brand Layer
     ↓
Semantic Layer
     ↓
Core/Base Layer
     ↓
Component Layer

```
---

## Architecture Diagram

```javascript
+----------------------------------+
|        AEM Components            |
|  Button, Card, Banner, Tabs     |
+----------------------------------+
                ↓
+----------------------------------+
|      Semantic Design Tokens      |
|  color-primary, text-heading    |
|  spacing-content, radius-card   |
+----------------------------------+
                ↓
+----------------------------------+
|        Base Tokens               |
|  blue-500, gray-100, space-4    |
+----------------------------------+
                ↓
+----------------------------------+
|         Brand Overrides          |
|    Brand A / Brand B / Brand C   |
+----------------------------------+

```
This allows:

- **Brand flexibility**
- **Component stability**
- **Design consistency**
---

A practical **token file structure** might look like:

```javascript
design-system
  tokens
    core
      colors.json
      spacing.json
      typography.json

    semantic
      colors.json
      layout.json

    brands
      brand-a.json
      brand-b.json

```
---

### Base Tokens

```javascript
tokens/core/colors.json

```
```javascript
{
  "blue-500": "#0055ff",
  "blue-600": "#0044cc",
  "gray-100": "#f5f5f5",
  "gray-900": "#222222"
}

```
---

### Spacing Tokens

```javascript
{
  "space-xs": "4px",
  "space-sm": "8px",
  "space-md": "16px",
  "space-lg": "24px"
}

```
---

Semantic tokens represent **UI intent**.

```javascript
tokens/semantic/colors.json

```
```javascript
{
  "color-primary": "{blue-500}",
  "color-text-body": "{gray-900}",
  "color-background": "{gray-100}"
}

```
These tokens connect **design meaning** to **actual values**.

---

Using tools like **Style Dictionary**, tokens can be converted into CSS variables.

Example output:

```javascript
:root {
  --color-primary: #0055ff;
  --color-text-body: #222222;

  --space-sm: 8px;
  --space-md: 16px;
}

```
---

Example **AEM component CSS**

```javascript
.cmp-button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
}

```
Benefits:

- Components stay
- Tokens control visual design
---

In many enterprise systems we build **Web Component design systems** used inside AEM.

Example button component.

```javascript
class DSButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="ds-button">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ds-button", DSButton);

```
CSS:

```javascript
.ds-button {
  background: var(--color-primary);
  padding: var(--space-md);
  color: white;
}

```
Now the same component works across **multiple brands**.

---

Enterprise AEM installations often run **multiple brands**.

Example:

```javascript
siteA.com
siteB.com
siteC.com

```
Each brand overrides tokens.

### Brand A

```javascript
:root {
  --color-primary: #0055ff;
}

```
### Brand B

```javascript
:root {
  --color-primary: #cc3300;
}

```
Components **do not change**.

---

## Multi-site Token Diagram

```javascript
               Shared Components
                      |
                      |
        +-------------+-------------+
        |                           |
     Brand A                    Brand B
  Token Overrides             Token Overrides
        |                           |
        |                           |
   Theme CSS                   Theme CSS
        |                           |
      AEM Site A                 AEM Site B

```
---

Tokens are typically delivered via **clientlibs**.

Example structure:

```javascript
/apps/design-system/clientlibs/tokens
   css/tokens.css
   js/tokens.js

```
Clientlib config:

```javascript
categories = ["design.tokens"]

```
Components include:

```javascript
design.tokens
design.components

```
This ensures tokens load **before components**.

---

A modern design system pipeline often looks like this:

```javascript
Figma Design System
        |
        | (Design Token Export)
        ↓
Design Token JSON
        |
        | (Style Dictionary Build)
        ↓
CSS Variables / SCSS
        |
        ↓
AEM Client Libraries
        |
        ↓
AEM Components

```
---

One of the biggest mistakes teams make is letting tokens grow uncontrolled.

Best practices:

### 1. Token Naming Convention

Bad:

```javascript
blue-color
blue2
main-blue

```
Good:

```javascript
color-primary
color-background
color-text-heading

```
---

### 2. Do Not Use Raw Values in Components

Avoid:

```javascript
color: #0055ff;

```
Use:

```javascript
color: var(--color-primary);

```
---

### 3. Token Review Process

Introduce **design system governance**.

Changes go through:

```javascript
Designer → Design System Team → Token Update → Build → Release

```
---

When scaling across **20+ sites**, tokens become even more critical.

Recommended approach:

### Token Categories

```javascript
Global tokens
Brand tokens
Component tokens

```
Example:

```javascript
--space-md
--color-primary
--button-padding
--card-border-radius

```
---

Some real lessons learned implementing tokens in enterprise environments:

### Lesson 1 — Start with a small token set

Too many tokens confuse developers.

Start with:

- color
- spacing
- typography
- radius
---

### Lesson 2 — Align designers and developers early

If designers don't follow token logic in Figma, the system breaks.

---

### Lesson 3 — Avoid component-specific tokens initially

Bad example:

```javascript
--button-blue
--card-blue

```
Better:

```javascript
--color-primary

```
---

### Lesson 4 — Document tokens

Use **Storybook or Zeroheight** to document tokens.

Example:

```javascript
Primary Color
Token: --color-primary
Usage: Buttons, Links

```
---

Design Tokens are the **foundation of scalable design systems in AEM**.

They allow:

- Consistent UI across sites
- Easier theming
- Better designer-developer collaboration
- Long-term maintainability
In every enterprise AEM platform I’ve worked on, the maturity of the design system was directly tied to **how well tokens were architected**.

If you're building a **multi-site AEM platform**, investing in a **well-structured design token architecture early** will save **years of maintenance effort later**.

---

If you're interested, in my next post I'll cover:

**"Building a Web Component Based Design System for AEM"**

including:

- Storybook integration
- versioning strategy
- component distribution across multiple AEM projects.
When working on large **multi-site AEM platforms**, one of the biggest challenges is maintaining **visual consistency, scalability, and maintainability** across dozens of brands, templates, and components.

In many enterprise projects I’ve worked on, the turning point for scaling a design system successfully was introducing a **Design Token Architecture**.

Without tokens:

- CSS variables become inconsistent
- Design decisions get duplicated
- Brand updates become painful
- Multi-site theming becomes fragile
With tokens:

- Design decisions become **systemized**
- UI components become **portable**
- Multi-brand theming becomes manageable
- Designers and developers speak the **same language**
This article explains:

- What **Design Tokens** mean in an AEM ecosystem
- How to **architect a token system** for enterprise projects
- How to **implement tokens in AEM components**
- How to **scale across multiple sites and brands**
- How to **maintain tokens long term**
Everything here comes from lessons learned while building **enterprise multi-site AEM platforms with Web Components and design systems**.

---

Design tokens are **the smallest units of design decisions**.

Instead of writing raw values like:

```javascript
color: #0055ff;
padding: 16px;
font-size: 14px;

```
We define **semantic variables** that represent design meaning.

```javascript
color: var(--color-primary);
padding: var(--space-md);
font-size: var(--font-body);

```
These tokens represent:

| Token Type | Example |
| --- | --- |
| Color | primary, secondary |
| Spacing | sm, md, lg |
| Typography | body, heading |
| Border Radius | sm, md |
| Elevation | shadow levels |
| Breakpoints | mobile, tablet |

Tokens **decouple design decisions from implementation**.

---

AEM projects often have:

- Multiple sites
- Multiple brands
- Shared component libraries
- Long-term maintenance
Without tokens, components become **hardcoded and unscalable**.

### Example Problem

Imagine 50 components using:

```javascript
#0055ff

```
Now brand changes to:

```javascript
#0066cc

```
You must update **50+ components**.

With tokens:

```javascript
--color-primary

```
You change it **once**.

---

In enterprise AEM projects, tokens should follow **a layered architecture**.

### Token Layering Model

```javascript
Brand Layer
     ↓
Semantic Layer
     ↓
Core/Base Layer
     ↓
Component Layer

```
---

## Architecture Diagram

```javascript
+----------------------------------+
|        AEM Components            |
|  Button, Card, Banner, Tabs     |
+----------------------------------+
                ↓
+----------------------------------+
|      Semantic Design Tokens      |
|  color-primary, text-heading    |
|  spacing-content, radius-card   |
+----------------------------------+
                ↓
+----------------------------------+
|        Base Tokens               |
|  blue-500, gray-100, space-4    |
+----------------------------------+
                ↓
+----------------------------------+
|         Brand Overrides          |
|    Brand A / Brand B / Brand C   |
+----------------------------------+

```
This allows:

- **Brand flexibility**
- **Component stability**
- **Design consistency**
---

A practical **token file structure** might look like:

```javascript
design-system
  tokens
    core
      colors.json
      spacing.json
      typography.json

    semantic
      colors.json
      layout.json

    brands
      brand-a.json
      brand-b.json

```
---

### Base Tokens

```javascript
tokens/core/colors.json

```
```javascript
{
  "blue-500": "#0055ff",
  "blue-600": "#0044cc",
  "gray-100": "#f5f5f5",
  "gray-900": "#222222"
}

```
---

### Spacing Tokens

```javascript
{
  "space-xs": "4px",
  "space-sm": "8px",
  "space-md": "16px",
  "space-lg": "24px"
}

```
---

Semantic tokens represent **UI intent**.

```javascript
tokens/semantic/colors.json

```
```javascript
{
  "color-primary": "{blue-500}",
  "color-text-body": "{gray-900}",
  "color-background": "{gray-100}"
}

```
These tokens connect **design meaning** to **actual values**.

---

Using tools like **Style Dictionary**, tokens can be converted into CSS variables.

Example output:

```javascript
:root {
  --color-primary: #0055ff;
  --color-text-body: #222222;

  --space-sm: 8px;
  --space-md: 16px;
}

```
---

Example **AEM component CSS**

```javascript
.cmp-button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
}

```
Benefits:

- Components stay **theme agnostic**
- Tokens control visual design
---

In many enterprise systems we build **Web Component design systems** used inside AEM.

Example button component.

```javascript
class DSButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="ds-button">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ds-button", DSButton);

```
CSS:

```javascript
.ds-button {
  background: var(--color-primary);
  padding: var(--space-md);
  color: white;
}

```
Now the same component works across **multiple brands**.

---

Enterprise AEM installations often run **multiple brands**.

Example:

```javascript
siteA.com
siteB.com
siteC.com

```
Each brand overrides tokens.

### Brand A

```javascript
:root {
  --color-primary: #0055ff;
}

```
### Brand B

```javascript
:root {
  --color-primary: #cc3300;
}

```
Components **do not change**.

---

## Multi-site Token Diagram

```javascript
               Shared Components
                      |
                      |
        +-------------+-------------+
        |                           |
     Brand A                    Brand B
  Token Overrides             Token Overrides
        |                           |
        |                           |
   Theme CSS                   Theme CSS
        |                           |
      AEM Site A                 AEM Site B

```
---

Tokens are typically delivered via **clientlibs**.

Example structure:

```javascript
/apps/design-system/clientlibs/tokens
   css/tokens.css
   js/tokens.js

```
Clientlib config:

```javascript
categories = ["design.tokens"]

```
Components include:

```javascript
design.tokens
design.components

```
This ensures tokens load **before components**.

---

A modern design system pipeline often looks like this:

```javascript
Figma Design System
        |
        | (Design Token Export)
        ↓
Design Token JSON
        |
        | (Style Dictionary Build)
        ↓
CSS Variables / SCSS
        |
        ↓
AEM Client Libraries
        |
        ↓
AEM Components

```
---

One of the biggest mistakes teams make is letting tokens grow uncontrolled.

Best practices:

### 1. Token Naming Convention

Bad:

```javascript
blue-color
blue2
main-blue

```
Good:

```javascript
color-primary
color-background
color-text-heading

```
---

### 2. Do Not Use Raw Values in Components

Avoid:

```javascript
color: #0055ff;

```
Use:

```javascript
color: var(--color-primary);

```
---

### 3. Token Review Process

Introduce **design system governance**.

Changes go through:

```javascript
Designer → Design System Team → Token Update → Build → Release

```
---

When scaling across **20+ sites**, tokens become even more critical.

Recommended approach:

### Token Categories

```javascript
Global tokens
Brand tokens
Component tokens

```
Example:

```javascript
--space-md
--color-primary
--button-padding
--card-border-radius

```
---

Some real lessons learned implementing tokens in enterprise environments:

### Lesson 1 — Start with a small token set

Too many tokens confuse developers.

Start with:

- color
- spacing
- typography
- radius
---

### Lesson 2 — Align designers and developers early

If designers don't follow token logic in Figma, the system breaks.

---

### Lesson 3 — Avoid component-specific tokens initially

Bad example:

```javascript
--button-blue
--card-blue

```
Better:

```javascript
--color-primary

```
---

### Lesson 4 — Document tokens

Use **Storybook or Zeroheight** to document tokens.

Example:

```javascript
Primary Color
Token: --color-primary
Usage: Buttons, Links

```
---

Design Tokens are the **foundation of scalable design systems in AEM**.

They allow:

- Consistent UI across sites
- Easier theming
- Better designer-developer collaboration
- Long-term maintainability
In every enterprise AEM platform I’ve worked on, the maturity of the design system was directly tied to **how well tokens were architected**.

If you're building a **multi-site AEM platform**, investing in a **well-structured design token architecture early** will save **years of maintenance effort later**.


