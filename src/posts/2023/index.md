---
permalink: '/create-accordion-in-velo/'
date: '2023-03-01T12:00:00.000Z'
modified: '2023-03-01T12:00:00.000Z'
lang: 'en'
title: 'Create accordion in Velo'
description: 'toggle'
image: '/assets/images/velo.png'
head: '
<style>
  ._error {
    background-color: #ff6d63;
    color: #fff;
    font-family: var(--font-mono);
    font-size: 0.8em;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0px 0px 3px #8f8f8f;
    max-width: 500px;
  }
</style>
'
---

# Create accordion in Velo

Let's try to solve a small developing task. We need to create an accordion component using Velo. The accordion <abbr title="User Interface">UI</abbr> is a vertically stacked list of options, it allows the user to show and hide sections.

We have three collapsed boxes with three buttons over each box. If we click on any button, it expands the box under the target button. If we click on another button, it collapses the expanded box and expands a box under this button.

<figure>
  <figcaption>
    <strong>Wix Editor: Accordion Component</strong>
  </figcaption>
  <img
    src="/assets/images/accordion-in-velo.jpg"
    alt="wix editor"
    loading="lazy"
  />
</figure>

Let's start to coding.

I want to create a function that will accept the selectors of elements that we want to [collapse](https://www.wix.com/velo/reference/$w/collapsedmixin/collapse) / [expand](https://www.wix.com/velo/reference/$w/collapsedmixin/expand).

The function returns a toggle function that will accept a target selector.

```js
const createToggle = (...selectors) => {
  const elements = $w(selectors.join());

  return (targetId) => {
    // TODO: add a toggle logic here
  };
};
```

[`$w.HiddenCollapsedElement`](https://www.wix.com/velo/reference/$w/hiddencollapsedelement)

```js
/** @type {$w.HiddenCollapsedElement[]} */
const elements = $w(selectors.join());
```

[`@template`](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#template)

```js
/**
 * @template {keyof PageElementsMap} T
 * @param {...T} selectors
 * @returns {(targetId: T) => void}
 */
const createToggle = (...selectors) => {
  /** @type {$w.HiddenCollapsedElement[]} */
  const elements = $w(selectors.join());

  return (targetId) => {
    // TODO: add a toggle logic here
  };
};
```

**Example of using a toggle API**

```js
$w.onReady(() => {
  const toggle = createToggle('#box1', '#box2', '#box3');

  $w('#button1').onClick(() => {
    toggle('#box1');
  });

  $w('#button2').onClick(() => {
    toggle('#box2');
  });

  $w('#button3').onClick(() => {
    toggle('#box3');
  });
});
```

<div class="_error">
  Argument of type '"#box"' is not assignable to parameter of type 'keyof PageElementsMap'.
</div>

**Type inference for `createToggle` function**

```ts
const createToggle: <"#box1" | "#box2" | "#box3">(...selectors: ("#box1" | "#box2" | "#box3")[]) => (targetId: "#box1" | "#box2" | "#box3") => void
```

<div class="_error">
  Argument of type '"#box"' is not assignable to parameter of type '"#box1" | "#box2" | "#box3"'.
</div>

**Type inference for returned `toggle(targetId)` function**

```ts
const toggle: (targetId: "#box1" | "#box2" | "#box3") => void
```

```diff-js
/**
 * @template {keyof PageElementsMap} T
 * @param {...T} selectors
 * @returns {(targetId: T) => void}
 */
const createToggle = (...selectors) => {
  /** @type {$w.HiddenCollapsedElement[]} */
  const elements = $w(selectors.join());

  return (targetId) => {
+    const id = targetId.replace(/^#/, '');
+
+    elements.forEach((e) => {
+      if (e.id === id && !e.isVisible) {
+        e.expand();
+      } else {
+        e.collapse();
+      }
+    });
  };
};
```

<figure>
 <figcaption>
    <strong>Live Demo</strong>
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/toggle"
    title=""
    height="440"
  ></iframe>
</figure>

## Code Snippet

<details>
  <summary>
    <strong>Home Page (code)</strong>
  </summary>

```js
/**
 * @template {keyof PageElementsMap} T
 * @param {...T} selectors
 * @returns {(targetId: T) => void}
 */
const createToggle = (...selectors) => {
  /** @type {$w.HiddenCollapsedElement[]} */
  const elements = $w(selectors.join());

  return (targetId) => {
    const id = targetId.replace(/^#/, '');

    elements.forEach((e) => {
      if (e.id === id && !e.isVisible) {
        e.expand();
      } else {
        e.collapse();
      }
    });
  };
};

$w.onReady(() => {
  const toggle = createToggle('#box1', '#box2', '#box3');

  $w('#button1').onClick(() => {
    toggle('#box1');
  });

  $w('#button2').onClick(() => {
    toggle('#box2');
  });

  $w('#button3').onClick(() => {
    toggle('#box3');
  });
});
```
</details>

## Posts

- [Types definitions for Custom Components](/types-definitions-for-custom-components/)
- [Server Side Rendering and Warmup Data APIs](/ssr-and-warmup-data/)
- [Add hotkeys to Wix site](/hotkeys-custom-element/)
- [Download your Velo code files to your computer](/velo-filesystem-chrome-extension/)
