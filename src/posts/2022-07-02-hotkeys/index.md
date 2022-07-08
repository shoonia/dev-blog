---
permalink: '/hotkeys-custom-element/'
date: '2022-07-02T12:00:00.000Z'
modified: '2022-07-02T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Add hotkeys to Wix site'
description: 'In this article, we look at how to add hotkeys to your Wix site with the Custom Element and tiny npm library'
image: '/assets/images/domus-tales-from-the-loop.jpg'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=2"/>
'
---

# Velo by Wix: Add hotkeys to Wix site

*In this article, we look at how to add hotkeys to your Wix site with the Custom Element and tiny npm library*

![concept art by television serial - tales from the loop](/assets/images/domus-tales-from-the-loop.jpg)

I had a small task to add some hotkey combinations to the Wix site. The Velo doesn't have an API for this. But we are able to solve this issue with the [Custom Element](https://www.wix.com/velo/reference/$w/customelement).

<aside>

❗ **Important**

Only premium Wix users on sites with their [own domain and Wix ads removed](https://manage.wix.com/account/domains) can work with custom elements.
</aside>

## Create Custom Element

Let's start by creating a custom element. We should create a folder `custom-elements` in the `public` sidebar section. It's a required folder structure. In the `custom-elements` folder, I create a JavaScript file `hot-keys.js`

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
      hot-keys.js
    </div>
  </div>
</div>

Create a [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) for the custom element. For our element, we need to write the next [lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks):

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
// The name you used when registering the element.
// You will need it when defining the tag name while adding the element in the Editor.
```

## Adding the Custom Element to a site page

1. Click **Add** <svg width="1em" height="1em"><path d="M9.5 1A7.5 7.5 0 0 1 17 8.5 7.5 7.5 0 0 1 9.5 16 7.5 7.5 0 0 1 2 8.5 7.5 7.5 0 0 1 9.5 1zm0 1A6.508 6.508 0 0 0 3 8.5C3 12.084 5.916 15 9.5 15S16 12.084 16 8.5 13.084 2 9.5 2zm.5 3v3h3v1h-3v3H9V9H6V8h3V5h1z"/></svg> on the left side of the Editor.
1. Click **Embed Code**.
1. Click the Custom Element to add it to your page.
1. Click **Velo File** and select the `hot-keys.js` file
1. Enter the tag name `hot-keys` that defined in `customElements.define()`

## Installing a Package

For keybinding, we will use a small library [tinykeys](https://github.com/jamiebuilds/tinykeys).

[Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)

tinykeys [Keybinding Syntax](https://github.com/jamiebuilds/tinykeys#keybinding-syntax)

<kbd>Shift</kbd>+<kbd>A</kbd>

**public/custom-elements/hot-keys.js**

```js
import tinykeys from 'tinykeys';

class HotKeys extends HTMLElement {
  connectedCallback() {
    this._unsubscribe = tinykeys(window, {
      'Shift+A': () => {
        alert("The 'Shift' and 'a' keys were pressed at the same time");
      },
    });
  }

  disconnectedCallback() {
    this._unsubscribe?.();
  }
}

customElements.define('hot-keys', HotKeys);
```

## Custom Events

```js
this.dispatchEvent(new CustomEvent('event-name'));
```

```js
$w('#customElement1').on('event-name', () => {
  // ...
});
```

**public/custom-elements/hot-keys.js**

```js
import tinykeys from 'tinykeys';

class HotKeys extends HTMLElement {
  connectedCallback() {
    this._unsubscribe = tinykeys(window, {
      'Shift+A': () => {
        this.dispatchEvent(new CustomEvent('Shift+A'));
      },
    });
  }

  disconnectedCallback() {
    this._unsubscribe?.();
  }
}

customElements.define('hot-keys', HotKeys);
```

**Page Code Tab**

```js
$w.onReady(function () {
  let i = 0;

  $w('#text1').text = `${i}`;

  $w('#customElement1').on('Shift+A', () => {
    $w('#text1').text = `${++i}`;
  });
});
```

## Configuring hotkeys

- Counter increase: <kbd>Shift</kbd>+<kbd>A</kbd>
- Counter decrease: <kbd>Shift</kbd>+<kbd>D</kbd>

**public/keys.js**

```js
/** @enum {string} */
export const Keys = {
  shiftA: 'Shift+A',
  shiftD: 'Shift+D',
};
```

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
      hot-keys.js
    </div>
  </div>
   <div class="_filetree_tab _filetree_row">
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

- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
- [Query selector for child elements](/velo-query-selector-for-child-elements/)
- [Promise Queue](/promise-queue/)
