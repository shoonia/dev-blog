---
publish: false
path: '/wix-micro-fix'
template: 'default'
date: '2019-11-03T12:00:00.000Z'
lang: 'en'
title: 'Wix micro fix'
description: "Chrome extension fixing little bugs on WIX editor"
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_ae55f2a2e4ec4f598fbf84fc193894e9~mv2.png'
---

# Wix micro fix

*Chrome extension fixing little bugs on WIX editor*

![](https://raw.githubusercontent.com/shoonia/wix-micro-fix/master/image/jump.gif)

The web editor Wix has a little bug on left sidebar. When you have a lot of pages or files on site and you hover to items on bottom then sidebar start to jump. In my projects are always lots of files. So I created the very simple extension to fix it.

This extension runs only on editor page it add a small CSS file which nullify container’s padding.

```css
/* FIX: file tree jumps */
.wix-code-ide-tree .dropdown > .dd > .selected-container {
  padding: 0 !important;
}
```
## Install extension:

- [Chrome Web Store](https://chrome.google.com/webstore/detail/wix-micro-fix/ohgjlllladomoiphcbjgbfeohlahmeki)
- [Repository on GitHub](https://github.com/shoonia/wix-micro-fix)
