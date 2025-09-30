# Render LaTeX in NotebookLM (Userscript)

This is a **Tampermonkey userscript** that automatically renders LaTeX math inside [Google NotebookLM](https://notebooklm.google.com) using **KaTeX**.  
It’s designed to be minimal, stable, and robust—just math rendering, no extra clutter.

---

## ✨ Features
- Renders inline math (`$...$`) and display math (`$$...$$`, `$begin:math:display$...$end:math:display$`, `$begin:math:text$...$end:math:text$`).
- Ignores active input fields and editors while you type (no flickering).
- Cleans up simple `$$...$$` into inline `$...$` when appropriate.
- Uses KaTeX for **fast and reliable math rendering**.

---

## 📦 Requirements
- **Tampermonkey** (or a compatible userscript manager).
  - [Chrome / Edge](https://www.tampermonkey.net/)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

---

## 🚀 Installation
1. Install Tampermonkey.
2. Click this link to install/update the script:  
   👉 [Install Userscript](https://raw.githubusercontent.com/<your-username>/notebooklm-katex-userscript/main/src/notebooklm-katex.user.js)
3. Open [NotebookLM](https://notebooklm.google.com) — math should render automatically.

---

## 🛠 How It Works
- Injects **KaTeX CSS & JS** via CDN.
- Watches the DOM for changes (MutationObserver).
- Runs KaTeX’s `renderMathInElement` on NotebookLM content.
- Avoids re-rendering while you’re typing.

---

## 🔧 Troubleshooting
- If math doesn’t appear, reload the page.
- Make sure the userscript is **enabled** in Tampermonkey.
- Conflicts may occur with other math renderers.

---

## 📄 License
MIT © [Your Name]
