# Render LaTeX in NotebookLM (Userscript)

A **Tampermonkey userscript** that automatically renders LaTeX math inside [Google NotebookLM](https://notebooklm.google.com) using **KaTeX**.  
Minimal, stable, and robust — just math rendering, nothing extra.

---

## ✨ Features
- Renders inline math (`$...$`) and display math (`$$...$$`, `$begin:math:text$...$end:math:text$`, `$begin:math:display$...$end:math:display$`).
- Ignores active input fields and editors while you type (no flickering).
- Cleans up simple `$$...$$` into inline `$...$` when appropriate.
- Uses KaTeX for **fast and reliable math rendering**.

---

## 📦 Requirements
You need a userscript manager such as **Tampermonkey**:

- [Tampermonkey for Chrome / Edge](https://www.tampermonkey.net/)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

---

## 🚀 Installation
1. Install **Tampermonkey** in your browser.
2. Add the userscript by visiting the raw [file](https://github.com/shri-kj/notebooklm-katex-userscript/blob/main/notebooklm-katex.user.js)
3. Copy paste script into tampermonkey
4. Enable script
3. Open [NotebookLM](https://notebooklm.google.com) — math should render automatically.
