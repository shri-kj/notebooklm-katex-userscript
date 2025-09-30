/* global globalThis */
// ==UserScript==
// @name         Render LaTeX in NotebookLM (robust)
// @namespace    https://github.com/shri-kj/notebooklm-katex-userscript
// @version      2.1.1
// @description  Minimal, stable KaTeX auto-render for NotebookLM with safe loading & no-undef fixes. Requires Tampermonkey.
// @author       ergs0204 + Zolangui + shri
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css
// @license      MIT
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';
  console.info('[NotebookLM KaTeX] userscript loaded');

  // ------- Helpers -------
  const getAutoRender = () =>
    (typeof globalThis !== 'undefined' && globalThis.renderMathInElement) ||
    (typeof window !== 'undefined' && window.renderMathInElement) ||
    null;

  const addKaTeXStyles = () => {
    try {
      if (typeof GM_getResourceText === 'function') {
        const css = GM_getResourceText('katexCSS');
        if (css) GM_addStyle(css);
        else injectLink();
      } else {
        injectLink();
      }
    } catch {
      injectLink();
    }
  };

  const injectLink = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
    document.head.appendChild(link);
  };

  const addCustomStyles = () => {
    GM_addStyle(`
      .katex { vertical-align: -0.1em; }
    `);
  };

  // Light preprocessor: convert simple $$...$$ to inline $...$ to avoid oversized display blocks
  const preprocessAndSanitize = (node) => {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.nodeValue ?? '';
      let newText = originalText;

      const displayMathRegex = /\$\$(.*?)\$\$/gs;
      let temp = newText;
      let m;
      while ((m = displayMathRegex.exec(temp)) !== null) {
        const content = (m[1] ?? '').trim();
        const isComplex =
          content.length > 25 ||
          content.includes('\\begin') ||
          content.includes('\\frac') ||
          content.includes('\\sum') ||
          content.includes('\\int') ||
          content.includes('\\lim') ||
          content.includes('\\\\') ||
          content.split(/\s+/).length > 4;

        if (!isComplex) {
          newText = newText.replace(`$$${m[1]}$$`, `$${content}$`);
        }
      }

      if (newText !== originalText) node.nodeValue = newText;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const skip = ['SCRIPT', 'STYLE', 'TEXTAREA', 'PRE', 'CODE'];
      if (skip.includes(node.tagName)) return;
      for (const child of Array.from(node.childNodes)) {
        preprocessAndSanitize(child);
      }
    }
  };

  const ignoreClass = 'katex-ignore-active-render';
  const katexOptions = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true },
    ],
    ignoredClasses: [ignoreClass],
    throwOnError: false,
  };

  let renderTimeoutId = null;

  const renderPageWithIgnore = () => {
    const autoRender = getAutoRender();
    if (!autoRender) return;

    const activeEl = document.activeElement;
    let added = false;

    try {
      if (
        activeEl &&
        (activeEl.isContentEditable ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'INPUT')
      ) {
        activeEl.classList.add(ignoreClass);
        added = true;
      }

      preprocessAndSanitize(document.body);
      autoRender(document.body, katexOptions);
    } catch (e) {
      console.error('[NotebookLM KaTeX] render error:', e);
    } finally {
      if (added && activeEl) activeEl.classList.remove(ignoreClass);
    }
  };

  const scheduleRender = (delay = 300) => {
    clearTimeout(renderTimeoutId);
    renderTimeoutId = setTimeout(() => {
      if (!getAutoRender()) {
        // retry with capped backoff until auto-render is ready
        scheduleRender(Math.min(1000, Math.max(150, delay + 100)));
        return;
      }
      renderPageWithIgnore();
    }, delay);
  };

  const start = () => {
    addKaTeXStyles();
    addCustomStyles();

    // Observe dynamic SPA updates
    const obs = new MutationObserver(() => scheduleRender(250));
    obs.observe(document.body, { childList: true, subtree: true });

    // Initial render (with readiness checks)
    scheduleRender(300);
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
