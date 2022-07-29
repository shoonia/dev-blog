---
permalink: '/types-definitions-for-custom-components/'
date: '2022-07-29T12:00:00.000Z'
modified: '2022-07-29T12:00:00.000Z'
lang: 'en'
title: 'Velo By Wix: Types definitions for Custom Components'
description: 'How to add support type checking for DOM elements in Velo using TypeScript Triple-Slash Directives'
image: '/assets/images/johnny-mnemonic.jpeg'
---

# Velo By Wix: Types definitions for Custom Components

*How to add support type checking for DOM elements in Velo using TypeScript Triple-Slash Directives*

![computer scene in the 'johnny mnemonic' movie](/assets/images/johnny-mnemonic.jpeg)

Velo editor has the built-in [TypeScript](https://www.typescriptlang.org/) compiler for type checking and code auto-completion. In the previous two posts, we looked at how to use [JSDoc](https://jsdoc.app/) types annotation for Velo elements. And how to create global types.

1. [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
1. [Global type definitions](/global-type-definitions-in-velo/)

<figure>
  <img
    src="/assets/images/auto-completion.jpg"
    alt="code completion in velo editor"
    loading="lazy"
  />
  <figcaption>
    <em>Example of code autocomplete</em>
  <figcaption>
</figure>

In this post, we look at how to add type support for [Custom Components](https://support.wix.com/en/article/velo-about-custom-elements) development when we use Browser APIs like the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window), [document](https://developer.mozilla.org/en-US/docs/Web/API/Document), [customElements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements), etc.

## DOM types support

In Velo, we have built-in support for <abbr title="Document Object Model">DOM</abbr> types. The <abbr title="Document Object Model">DOM</abbr> types are disabled by default. We can turn on it with the special JavaScript comment. TypeScript uses this comment as compiler directives.

<figure>
  <figcaption>
    <cite>The TypeScript Handbook:</cite>
    <a href="https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html">Triple-Slash Directives</a>
  </figcaption>
  <blockquote cite="https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html">
    Triple-slash directives are single-line comments containing a single XML tag. The contents of the comment are used as compiler directives.
  </blockquote>
</figure>

All we need to do it's add a Triple-slash directive to the top of the file where we will use <abbr title="Document Object Model">DOM</abbr> APIs.

**Add DOM types checking in Velo editor**

```ts
/// <reference lib="dom" />
```

With this directive, TypeScript starts to use DOM types. 🙌

<figure>
  <figcaption>
    <strong>Using Triple-Slash Directives in Velo</strong>
  </figcaption>
  <video
    src="/assets/videos/triple-slash-directives.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  />
</figure>

It's open to us to write part of the Custom Component code in public files. Just try the next code in your project:

<div class="filetree" role="img" aria-label="velo sidebar">
  <div class="filetree_tab filetree_row">
    <strong>Public & Backend</strong>
  </div>
  <div class="filetree_title filetree_row">
    <img src="/assets/images/i/open.svg" alt=""/>
    Public
  </div>
  <div class="filetree_tab">
    <div class="filetree_row">
      <img src="/assets/images/i/open.svg" alt=""/>
      <img src="/assets/images/i/folder.svg" alt=""/>
      custom-elements
    </div>
    <div class="filetree_tab filetree_row">
      <img src="/assets/images/i/js.svg" alt=""/>
      my-button.js
    </div>
  </div>
   <div class="filetree_tab filetree_row">
    <img src="/assets/images/i/js.svg" alt=""/>
    util.js
  </div>
</div>

**util.js**

```js
/// <reference lib="dom" />

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tagName
 * @param {Partial<HTMLElementTagNameMap[T]>} [attrs]
 * @returns {HTMLElementTagNameMap[T]}
 */
const createElement = (tagName, attrs) => {
  return Object.assign(document.createElement(tagName), attrs);
}
```
**public/custom-elements/my-button.js**

```js
import { createElement } from 'public/dom';

const css = `
.my-button {
  border: 1px solid #000;
  padding: 10px 20px;
  cursor: pointer;
}
`;

class MyButton extends HTMLElement {
  constructor() {
    super();

    const style = createElement('style', {
      textContent: css,
    });

    const button = createElement('button', {
      type: 'button',
      textContent: 'Click Me',
      className: 'my-button'
    });

    this.attachShadow({ mode: 'open' }).append(style, button);
  }
}

customElements.define('my-button', MyButton);
```
