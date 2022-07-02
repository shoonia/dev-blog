---
permalink: '/TODO/'
date: '2022-07-02T12:00:00.000Z'
modified: '2022-07-02T12:00:00.000Z'
lang: 'en'
title: 'Hotkeys'
description: 'TODO'
image: '/assets/images/velo.png'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=2"/>
'
---

# Hotkeys

## Code Snippet

<div class="_filetree" role="presentation" aria-label="velo sidebar">
  <div class="_filetree_tab _filetree_row">
    <strong>Public & Backend</strong>
  </div>
  <div class="_filetree_title _filetree_row">
    <img src="/assets/images/i/open.svg" alt=""/>
    Public
  </div>
  <div class="_filetree_tab">
    <div class="_filetree_row">
      <img src="/assets/images/i/open.svg" alt=""/>
      <img src="/assets/images/i/folder.svg" alt=""/>
      custom-elements
    </div>
    <div class="_filetree_tab _filetree_row">
      <img src="/assets/images/i/js.svg" alt=""/>
      tiny-keys.js
    </div>
  </div>
   <div class="_filetree_tab _filetree_row">
    <img src="/assets/images/i/js.svg" alt=""/>
    keys.js
  </div>
</div>
<details>
  <summary>
    <strong>public/custom-elements/tiny-keys.js</strong>
  </summary>

```js
import tinykeys from 'tinykeys';
import { Keys } from 'public/keys';

class TinyKeys extends HTMLElement {
  connectedCallback() {
    const options = {};

    Object.values(Keys).forEach((type) => {
      options[type] = () => {
        this.dispatchEvent(new CustomEvent(type));
      };
    });

    this._unsubscribe = tinykeys(window, options);
  }

  disconnectedCallback() {
    this._unsubscribe?.();
  }
}

customElements.define('tiny-keys', TinyKeys);
```
</details>
<details>
  <summary>
    <strong>public/keys.js</strong>
  </summary>

```js
/** @enum {string} */
export const Keys = {
  shiftA: 'Shift+A',
  shiftD: 'Shift+D',
};
```
</details>
<details>
  <summary>
    <strong>Page Code Tab</strong>
  </summary>

```js
import { Keys } from 'public/keys';

$w.onReady(function () {
  let i = 0;

  $w('#text1').text = `${i}`;

  $w('#customElement1').on(Keys.shiftA, () => {
    $w('#text1').text = `${++i}`;
  });

  $w('#customElement1').on(Keys.shiftD, () => {
    $w('#text1').text = `${--i}`;
  });
});
```
</details>

## Resources

- [Wix Editor: Adding a Custom Element to Your Site](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site#adding-the-custom-element)
- [Velo APIs: CustomElement](https://www.wix.com/velo/reference/$w/customelement)
- [MDN: Using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [Web components: An introduction to writing raw Web Components](https://github.com/thepassle/webcomponents-from-zero-to-hero/tree/master/part-one)
