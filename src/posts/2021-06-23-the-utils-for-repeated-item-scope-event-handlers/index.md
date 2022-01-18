---
permalink: '/the-utils-for-repeated-item-scope-event-handlers/'
date: '2021-06-23T12:00:00.000Z'
modified: '2021-09-02T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: The utils for repeated item scope event handlers'
description: 'npm library with utils for event handlers in Repeater'
author: 'Alexander Zaytsev'
image: 'https://shoonia.site/assets/images/velo.png'
---

# Velo by Wix: The utils for repeated item scope event handlers

*npm library with utils for event handlers in Repeater*

In the article ["Event handling of Repeater Item"](/event-handling-of-repeater-item/), we considered how to handle events in the repeater items and why we shouldn't nest event handler inside the Repeater loop. There we created a code snippet that encapsulates the logic for receiving item selector and item data.

Copying and pasting the snippet of code isn't comfortable. Therefore I moved these little helpers to npm package [repeater-scope](https://github.com/shoonia/repeater-scope). You can install this package using [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)

<figure>
  <figcaption>
    <strong>Velo Package Manager</strong>
  </figcaption>
  <img
    src="/assets/images/install-repeater-scope.jpeg"
    alt="Installing an npm package in Velo editor"
  />
</figure>

There is available a method that can automatic find the parent Repeater by the fired `event` object.

<figure>
  <figcaption>
    <strong>Retrieve Repeater item data when clicked</strong>
  </figcaption>

```js
import { useScope } from 'repeater-scope';

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    const { $item, itemData, index, data } = useScope(event);

    $item('#repeatedText').text = itemData.title;
  });
});
```
</figure>

### Returns parameters

- **$item** - A selector function with [repeated item scope](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_repeated-item-scope).
- **itemData** - The object from the repeater's `data` array that corresponds to the repeated item being created.
- **index** - The index of the `itemData` object in the `data` array.
- **data** - [A repeater's data array](https://www.wix.com/velo/reference/$w/repeater/data)


## How it works

The `useScope(event)` accepts [Event](https://www.wix.com/velo/reference/$w/event) object. With the Event object, we can get the [target](https://www.wix.com/velo/reference/$w/event/target) element. It's the element that the event was fired on. Also, we can get a [type](https://www.wix.com/velo/reference/$w/element/type) and [parent](https://www.wix.com/velo/reference/$w/element/parent) element for any editor [element](https://www.wix.com/velo/reference/$w/element).

```js
// Gets the element that the event was fired on.
const targetElement = event.target;

// Gets the element's parent element.
const parentElement = event.target.parent;

// Gets the element's type.
const elementType = event.target.type;
```

In the first, let's find the parent repeater where the child item was handle. We will climb up the parent's elements until we will get the `$w.Repeater` element.

```js
let parentElement = event.target.parent;

// Check the parent element type.
// If it isn't a Repeater take the next parent of the parent element.
while (parentElement.type !== '$w.Repeater') {
  parentElement = parentElement.parent;
}
```

We get the repeater data array directly from the repeater property.

```js
const data = parentElement.data;
```

We have `itemId` in the event [context](https://www.wix.com/velo/reference/$w/event/context) object. With this ID we can found the current `itemData` and `index` where the event was fired from.

```js
// ID of the repeater item where the event was fired from
const itemId = event.context.itemId;

// Use the Array methods to find the current itemData and index
const itemData = data.find((i) => i._id === itemId);
const index = data.findIndex((i) => i._id === itemId);
```

And the last, we create a selector function for the target element. We can use the event context with [`$w.at()`](https://www.wix.com/velo/reference/$w/at) to get a selector function.

```js
// Gets a selector function
// which selects items from a specific repeater item
const $item = $w.at(event.context);
```

## Any questions?

If you have any issues as bugs, feature requests, and more, please contact me [GitHub Issue](https://github.com/shoonia/repeater-scope/issues), or my personal <a href="https://twitter.com/_shoonia" rel="me">Twitter</a>.

I hope this small library will helpful in your projects too.

## Resources

- [GitHub: `repeater-scope`](https://github.com/shoonia/repeater-scope)
- [Velo: About Packages](https://support.wix.com/en/article/velo-about-packages)
- [Velo: Understanding the Scope of Selector Functions](https://support.wix.com/en/article/velo-understanding-the-scope-of-selector-functions)

## Posts

- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [Imitating hover event on repeater container](/corvid-imitate-hover-event/)
- [Reduce server-side calls using a caching mechanism](/cache-for-the-jsw-functions/)
