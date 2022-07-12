---
permalink: '/hotkeys-custom-element/'
date: '2022-07-12T12:00:00.000Z'
modified: '2022-07-12T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Add hotkeys to Wix site'
description: 'In this article, we look at how to add hotkeys to your Wix site with the Custom Element and tiny npm library'
image: '/assets/images/domus-tales-from-the-loop.jpg'
---

# Velo by Wix: Add hotkeys to Wix site

*In this article, we look at how to add hotkeys to your Wix site with the Custom Element and tiny npm library*

![poster from the serial - tales from the loop](/assets/images/domus-tales-from-the-loop.jpg)

We have a task to add some hotkey combinations to the Wix site. The Velo doesn't have any API for keyboard bindings. But we are able to solve this issue with the [Custom Element](https://www.wix.com/velo/reference/$w/customelement) and small npm library [tinykeys](https://github.com/jamiebuilds/tinykeys).

## Custom Element

The custom element is a build-in browser set of JavaScript APIs that allow you to define your own custom elements and their behavior, which can then be used in your user interface. Velo has integration with Custom Elements APIs. We can use this technology on Wix Site. [About Custom Elements](https://support.wix.com/en/article/velo-about-custom-elements)

The Custom Element is available only on the Wix Site with its own domain (*not a free Wix domain like [user.wixsite.com/sitename](https://shoonia.wixsite.com/blog)*) it's a security reason.

<aside>

❗ **Important**

Only premium Wix users on sites with their [own domain and Wix ads removed](https://manage.wix.com/account/domains) can work with custom elements.
</aside>

Let's start by creating a custom element. We should create a folder `custom-elements` in the `public` sidebar section. It's a required folder structure. In the `custom-elements` folder, we create `hot-keys.js` file.

<div class="filetree" role="presentation" aria-label="velo sidebar">
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
      hot-keys.js
    </div>
  </div>
</div>

Create a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) with two [lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks):

- `connectedCallback()` for adding the keyboard event listener
- `disconnectedCallback()` for cleaning the listeners

**public/custom-elements/hot-keys.js**

```js
class HotKeys extends HTMLElement {
  // Invoked when
  // the custom element is first connected to the document's DOM.
  connectedCallback() {
    // add event listeners here ...
  }

  // Invoked when
  // the custom element is disconnected from the document's DOM.
  disconnectedCallback() {
    // remove event listeners here ...
  }
}

// Register a new custom element
customElements.define('hot-keys', HotKeys);
```

## Add the Custom Element to a site page

We should add Custom Element to the site page where we want to use it.

1. Click **Add** <svg width="1em" height="1em"><path d="M9.5 1A7.5 7.5 0 0 1 17 8.5 7.5 7.5 0 0 1 9.5 16 7.5 7.5 0 0 1 2 8.5 7.5 7.5 0 0 1 9.5 1zm0 1A6.508 6.508 0 0 0 3 8.5C3 12.084 5.916 15 9.5 15S16 12.084 16 8.5 13.084 2 9.5 2zm.5 3v3h3v1h-3v3H9V9H6V8h3V5h1z"/></svg> on the left side of the Editor.
1. Click **Embed Code**.
1. Click the Custom Element to add it to your page.
1. Click **Velo File** and select the `hot-keys.js` file
1. Enter the tag name `hot-keys` that defined in `customElements.define()`

<img
  src="/assets/images/add-custom-element.jpg"
  alt="add custom element in wix editor"
  loading="lazy"
/>

Our custom element won't have any <abbr title="User interface">UI</abbr>. We only need its functionality. You can move it anywhere in the Editor.

## Installing npm package

In this step, we install npm library [tinykeys](https://github.com/jamiebuilds/tinykeys) with Package Manager. This library covers all nuances of keybinding. It has a small size and good documentation.

<figure>
  <figcaption>

  [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
  </figcaption>
  <img
    src="/assets/images/tinykeys-install.jpg"
    alt="velo package manager popup"
    loading="lazy"
  />
</figure>

## Configuring hotkeys

Here we create a config file. Each keybinding will look like adding a new property to the config.

Let's suppose we want to listen <span style="white-space:nowrap"><kbd>Shift</kbd>+<kbd>A</kbd></span> and <span style="white-space:nowrap"><kbd>Shift</kbd>+<kbd>D</kbd></span> combinations. To config, we create an additional `keys.js` file in the public section.

Learn more about [keybinding syntax in the documentation](https://github.com/jamiebuilds/tinykeys#keybinding-syntax).

**public/keys.js**

```js
/** @enum {string} */
export const Keys = {
  shiftA: 'Shift+A',
  shiftD: 'Shift+D',
};
```

With `Keys` enum, we map the keybinding to the options object. Each listener is a function that will dispatch its own event type with [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

**public/custom-elements/hot-keys.js**

```js
import tinykeys from 'tinykeys';
import { Keys } from 'public/keys';

class HotKeys extends HTMLElement {
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

customElements.define('hot-keys', HotKeys);
```

We can [listen to triggered custom events from the custom element](https://www.wix.com/velo/reference/$w/customelement/on) on the Velo code. We also use the `Keys` enum to subscribe to the events in Velo.

**Page Code Tab**

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

## Code Snippet

We create a hotkeys listener on the Wix site with the Custom Elements component and Package Manager. Here are the full code snippets:

<div class="filetree" role="presentation" aria-label="velo sidebar">
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
      hot-keys.js
    </div>
  </div>
   <div class="filetree_tab filetree_row">
    <img src="/assets/images/i/js.svg" alt=""/>
    keys.js
  </div>
</div>
<details>
  <summary>
    <strong>public/custom-elements/hot-keys.js</strong>
  </summary>

```js
import tinykeys from 'tinykeys';
import { Keys } from 'public/keys';

class HotKeys extends HTMLElement {
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

customElements.define('hot-keys', HotKeys);
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

Do you have any questions? 🐦 [I'm on Twitter](https://twitter.com/_shoonia) ✍️

## Resources

- [Wix Editor: Adding a Custom Element to Your Site](https://support.wix.com/en/article/wix-editor-adding-a-custom-element-to-your-site#adding-the-custom-element)
- [Velo: About Custom Elements](https://support.wix.com/en/article/velo-about-custom-elements)
- [Velo APIs: CustomElement](https://www.wix.com/velo/reference/$w/customelement)

### Web components

- [An introduction to writing raw Web Components](https://github.com/thepassle/webcomponents-from-zero-to-hero/tree/master/part-one)
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [`Window.customElements`](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)
- [`CustomEvent()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

## Posts

- [Global type definitions](/global-type-definitions-in-velo/)
- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Download your Velo code files to your computer](/velo-filesystem-chrome-extension/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
