---
permalink: '/hotkeys-custom-element/'
date: '2022-07-02T12:00:00.000Z'
modified: '2022-07-02T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Add hotkeys to Wix site'
description: 'In this article, we look to how add hotkeys to your Wix site with the Custom Element'
image: '/assets/images/domus-tales-from-the-loop.jpg'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=2"/>
'
---

# Velo by Wix: Add hotkeys to Wix site

*In this article, we look to how add hotkeys to your Wix site with the Custom Element*

![concept art by television serial - tales from the loop](/assets/images/domus-tales-from-the-loop.jpg)

I had a small task to add some hotkey combinations to the Wix site. The Velo doesn't have an API for this. But we are able to solve this problem with the [Custom Element](https://www.wix.com/velo/reference/$w/customelement).

<aside>

**Important**: Only premium Wix users on sites with their [own domain and Wix ads removed](https://manage.wix.com/account/domains) can work with custom elements.
</aside>

[tinykeys](https://github.com/jamiebuilds/tinykeys)

[Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)

**public/custom-elements/tiny-keys.js**

```js
class TinyKeys extends HTMLElement {
  // Invoked when
  // the custom element is first connected to the document's DOM.
  connectedCallback() {
    // ...
  }

  // Invoked when
  // the custom element is disconnected from the document's DOM.
  disconnectedCallback() {
    // ...
  }
}

// Register a new custom element
customElements.define('tiny-keys', TinyKeys);
```

tinykeys [Keybinding Syntax](https://github.com/jamiebuilds/tinykeys#keybinding-sequences)

<kbd>Shift</kbd>+<kbd>A</kbd>

**public/custom-elements/tiny-keys.js**

```js
import tinykeys from 'tinykeys';

class TinyKeys extends HTMLElement {
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

customElements.define('tiny-keys', TinyKeys);
```

```js
this.dispatchEvent(new CustomEvent('event-name'));
```

```js
$w('#customElement1').on('event-name', () => {
  // ...
});
```

**public/custom-elements/tiny-keys.js**

```js
import tinykeys from 'tinykeys';

class TinyKeys extends HTMLElement {
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

customElements.define('tiny-keys', TinyKeys);
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

**public/custom-elements/tiny-keys.js**

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
