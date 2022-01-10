---
publish: false
path: '/xyz'
template: 'default'
date: '2022-01-08T12:00:00.000Z'
modified: '2022-01-08T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: The utils for repeated item event handlers v2.1.0'
description: ''
author: 'Alexander Zaytsev'
image: ''
---

# Velo by Wix: The utils for repeated item event handlers v2.1.0

<img
  src="/images/a.jpg"
  width="1021"
  height="460"
  alt="Concept ART by television serial - Tales from the loop"
  crossorigin="anonymous"
/>

1. [Event handling of Repeater Item](/event-handling-of-repeater-item) - here we considered how to handle events in the repeated items and we created a primitive helper function.
2. [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers) - here we created a more smart code snippet that can automatically receive parent Repeater data from the event was fired from.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/repeater/foritems">
    Use the <code>forItems()</code> function to run a function on a specified list of repeated items. You can use the callback function to update or pull information from the specified repeated items.
  </blockquote>
</figure>

<figure>
  <figcaption>
    <strong>Velo: Update data in some of a repeater's repeated items</strong>
  </figcaption>

  ```js
  $w('#myRepeater').forItems(['item1', 'item4'], ($item, itemData, index) => {
    $item('#repeatedImage').src = itemData.img;
    $item('#repeatedText').text = itemData.description;
  });
  ```
</figure>

[`context`](https://www.wix.com/velo/reference/$w/event/context)

```js
$w('#repeatedButton').onClick((event) => {
  // ID of the repeater item where the event was fired from.
  const itemId = event.context.itemId;
});
```

```js
$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    $w('#myRepeater').forItems([event.context.itemId], ($item, itemData, index) => {
      $item('#repeatedText').text = itemData.title;
    });
  });
});
```

<figure>
  <figcaption>
    <strong>Velo Package Manager</strong>
  </figcaption>
  <img
    src="/images/install-repeater-scope.jpeg"
    width="1486"
    height="400"
    alt="Installing an npm package in Velo editor"
    crossorigin="anonymous"
    loading="lazy"
    decoding="async"
  />
</figure>

<details>
  <summary>
    <strong>API</strong> of the repeater-scope package
  </summary>

- `useScope(event)`
- `createScope(event)`
- `getRepeater(event)` <small><em>(since v2.0.0)</small></em>
- `updateItem(event, callback)` <small><em>(since v2.0.0)</small></em>

**useScope**

Automatically find the parent Repeater by the emitted `event` object

```js
import { useScope } from 'repeater-scope';

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    const { $item, itemData, index, data } = useScope(event);

    $item('#repeatedText').text = itemData.title;
  });
});
```

**createScope**

Create scope function with specific data array. It can be useful with state management libraries for example [redux](https://redux.js.org/), [mobx](https://mobx.js.org/README.html) or [storeon-velo](https://github.com/shoonia/storeon-velo) etc.

```js
import { createScope } from 'repeater-scope';

// Create a scope with a callback function that returns actual repeater data.
const useScope = createScope(() => {
  return $w('#myRepeater').data;
});

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    const { $item, itemData, index, data } = useScope(event);

    $item('#repeatedText').text = itemData.title;
  });
});
```

**getRepeater**

Get parent Repeater by the emitted `event` object

```js
import { getRepeater } from 'repeater-scope';

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    const $repeater = getRepeater(event);

    $repeater.hide();
  });
});
```

**updateItem**

Update Repeated Item by the emitted event object

```js
import { updateItem } from 'repeater-scope';

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    updateItem(event, ($item, itemData, index) => {
      $item('#repeatedText').text = itemData.title;
    });
  });
});
```

</details>

## Resources

- [GitHub: `repeater-scope`](https://github.com/shoonia/repeater-scope)
- [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
- [Velo: Understanding the Scope of Selector Functions](https://support.wix.com/en/article/velo-understanding-the-scope-of-selector-functions)
- [Retrieve Repeater Item Data When Clicked](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked)

## Posts
