// @ts-check
import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

/**
 * Code blocks: titles, line/word highlights, diff, terminal frames, copy button.
 * Syntax reference: https://expressive-code.com/key-features/syntax-highlighting/
 */
export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  // Follow the OS by default; the theme toggle sets [data-theme] on <html>.
  useDarkModeMediaQuery: true,
  themeCssRoot: ':root',
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultProps: {
    showLineNumbers: false,
    wrap: false,
    overridesByLang: {
      'bash,sh,shell,zsh,powershell,ps,console': { frame: 'terminal' },
    },
  },
  styleOverrides: {
    borderRadius: '8px',
    borderColor: 'var(--color-border)',
    codeFontFamily: 'var(--font-code)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.65',
    uiFontFamily: 'var(--font-body)',
    uiFontSize: '0.8125rem',
    frames: {
      shadowColor: 'transparent',
      frameBoxShadowCssValue: 'none',
    },
  },
});
