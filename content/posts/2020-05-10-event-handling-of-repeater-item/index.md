---
publish: true
path: '/event-handling-of-repeater-item'
template: 'default'
date: '2020-05-10T12:00:00.000Z'
modified: '2021-04-19T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Event handling of Repeater Item'
description: "In this post, we consider why we shouldn't nest event handler inside the Repeater loop and how we can escape it"
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_15f0ef95e2d84ebf8542a488260e3001~mv2.jpg/v2/fill/w_300,h_300/i.jpg'
---

# Velo by Wix: Event handling of Repeater Item

*In this post, we consider why we shouldn't nest event handler inside the Repeater loop and how we can escape it.*

<img
  src="https://static.wixstatic.com/media/e3b156_15f0ef95e2d84ebf8542a488260e3001~mv2.jpg"
  width="733"
  height="453"
  alt="poster of tales from the loop"
  crossorigin="anonymous"
/>

At first sight, the adding event handling for repeated items looks easy.
You just handling events of repeated items inside Repeater loop methods there you have all needed data and scope with selector `$item()`.

```js
$w("#repeater").onItemReady(($item, itemData, index) => {
  // it look easy
  $item("#repeatedButton").onClick((event) => {
    // we have all we need
    console.log(
      $item("#repeatedContainer"),
      itemData,
      index,
    );
  });
});
```

What's wrong with this approach?

Sometimes the loop may set a few event handlers for the same item when you change order or filter or sort Repeater Items.
Each iteration of the loop may add a copy of the callback function to the handler when it starts again. You may don't pay attention to twice running code if you just hide or show some component by an event.
But if you work with APIs or wixData, then you can get a lot of problems.

My team and I consider this approach as an anti-pattern and we don't use it more.
For the "static" Repeaters which fill up once and don't change anymore during a user session, this approach can be used.

But if you would like to do dynamic fill up your Repeater or change its items, you shouldn't set a handler function inside the loop. Let's see another way.

## Selector Scope

In the Velo, we have two types of selector functions.

- [Global Scope Selectors](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_global-scope)
- [Repeated Item Scope Selectors](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_repeated-item-scope)

The Global Scope Selectors it's `$w()`. We can use it anywhere in the frontend part of Wix site.
If we use `$w()` with Repeater Items, then it changes all items

```js
// will change a text in all items
$w("#repeatedText").text = "new";
```

### Repeated Item Scope

*A selector with repeated item scope can be used to select a specific instance of a repeating element.*

We can get repeated-item-scope selector in a few ways.

In the **loop**, selector as the first argument in callback function for [`.forEachItem()`](https://www.wix.com/velo/reference/$w/repeater/foreachitem), [`.forItems()`](https://www.wix.com/velo/reference/$w/repeater/foritems), and [`.onItemReady()`](https://www.wix.com/velo/reference/$w/repeater/onitemready) methods.

**Deprecated** way, selector as the second argument in an event handler.
It still works but you don't have to use it. [Removal of the $w Parameter from Event Handlers](https://www.wix.com/velo/forum/tips-tutorials-examples/removal-of-the-w-parameter-from-event-handlers)

```js
// 🙅‍♀️ DON'T USE IT 🙅‍♂️
$w("#repeatedButton").onClick((event, $item) => {
  // deprecated selector function (could be removed in the future)
  $item("#repeatedText").text = "new";
});
```

And with an event **context**. We can get the selector function with [`$w.at(context)`](https://www.wix.com/velo/reference/$w/at).

```js
$w("#repeatedButton").onClick((event) => {
  // accepts an event context and
  // returns repeated items scope selector
  const $item = $w.at(event.context);

  $item("#repeatedText").text = "new";
});
```

Let's try to reproduce how we can use `event.context` instead of Repeater loop methods.

```js
// we use global selector `$w()`, it provides handling all repeated items
$w("#repeatedButton").onClick((event) => {
  // get repeated item scope
  const $item = $w.at(event.context);

  // get the ID of the repeated item which fired an event
  const itemId = event.context.itemId;
  // get all repeater's data, it's stored as an array of objects
  const data = $w("#repeater").data;
  // use the array methods to find the current itemData and index
  const itemData = data.find((item) => item._id === itemId);
  const index = data.findIndex((item) => item._id === itemId);

  // we have all we need
  console.log(
    $item('#repeatedContainer'),
    itemData,
    index,
  );
});
```

In this way, we have only one callback for all elements with the specific ID.
Using context we can get the active item scope, its itemData, and index

Now, we see how to do more careful handling of events in the Repeater.
But this code not good enough for reuse.
Let's move the scope selector logic out event handler to the separate method.

## Create hook

Our hook will have next steps:

*#1 Implementation*

```js
// here will be all logic
const createScope = (getData) => (event) => {
  // TODO: Implement hook
}
```

*#2 initialize*

```js
// sets callback function, it has to return the repeater data
const useScope = createScope(() => {
  return $w("#repeater").data;
});
```

*#3 using*

```js
// using with repeated items
$w("#repeatedButton").onClick((event) => {
  // returns all we need
  const { $item, itemData, index, data } = useScope(event);
});
```

We create a hook with `createScope(getData)` it will be work with a specific Repeater. The argument `getData` it's a callback, it has to return the Repeater data.

The `createScope` will return a new function `useScope(event)` that has a connection with the specific Repeater data. The `useScope(event)` accepts an `event` object and return the data of the current scope.

For the realization of `createScope(getData)` function, we will create a public file `public/util.js`

We can get Repeater data with `getData()`, and we have the event context. All we need just return Scope selector and item data as an object. We will use getter syntax for returning itemData, index, and data.

**public/util.js**

```js
export const createScope = (getData) => (event) => {
  const itemId = event.context.itemId;
  const find = (i) => i._id === itemId;

  return {
    $item: $w.at(event.context),

    get itemData() {
      return getData().find(find);
    },

    get index() {
      return getData().findIndex(find);
    },

    get data() {
      return getData();
    },
  };
};
```

[Code on GitHub](https://github.com/shoonia/repeater-scope)

If you don't work with getter/setter for property accessors you can look [here](https://javascript.info/property-accessors) how it works.

Let's see how we can use the hook on the page with [static](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events#adding-an-event-handler-to-an-element) or dynamic event handlers.

**HOME Page Code**

```js
import { createScope } from "public/util";

const useScope = createScope(() => {
  return $w("#repeater").data;
});

$w.onReady(() => {
  // use a dynamic event handler
  $w("#repeatedButton").onClick((event) => {
    const { $item, itemData, index, data } = useScope(event);
  });
});

// or a static event handler
export function repeatedButton_click(event) {
  const { $item, itemData, index, data } = useScope(event);
}
```

Now, we can reuse the selector hook with all Repeater in all site pages.

## JSDoc

*<time datetime="2020-12-05T12:00:00.000Z">Update (12.05.2020)</time>*

The Velo code editor supports [JSDoc](https://jsdoc.app), it's a markup language that is used inside JS block comments. JSDoc provides static type checking, adds the autocomplete, and making good documentation of your code. I recommend using JSDoc.

<details>
  <summary>
    <strong>Code snippet with JSDoc:</strong>
  </summary>

```js
/**
 * Create Repeated Item Scope
 * https://github.com/shoonia/repeater-scope
 *
 * @typedef {{
 *  _id: string;
 *  [key: string]: any;
 * }} ItemData;
 *
 * @typedef {{
 *   $item: $w.$w;
 *   itemData: ItemData;
 *   index: number;
 *   data: ItemData[];
 * }} ScopeData;
 *
 * @param {() => ItemData[]} getData
 * @returns {(event: $w.Event) => ScopeData}
 */
export const createScope = (getData) => (event) => {
  const itemId = event.context.itemId;
  const find = (i) => i._id === itemId;

  return {
    // @ts-ignore
    $item: $w.at(event.context),

    get itemData() {
      return getData().find(find);
    },

    get index() {
      return getData().findIndex(find);
    },

    get data() {
      return getData();
    },
  };
};
```

*Don't remove JSDoc in your code! In the building process, all comments will be removed automatically from the production bundle.*

</details>

## Resources

- [Code on GitHub](https://github.com/shoonia/repeater-scope)
- [Scope selector `$w.at(context)`](https://www.wix.com/velo/reference/$w/at)
- [Global Scope & Repeated Item Scope Selectors](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_selector-scope)
- [Event Context](https://www.wix.com/velo/reference/$w/event/context)
- [Property getters and setters](https://javascript.info/property-accessors)

## Posts

- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers)
- [A tiny event-based state manager Storeon for Velo](/corvid-storeon)
- [Using HTML template to the better performance](/html-template-in-corvid)
- [Imitating hover event on repeater container](/corvid-imitate-hover-event)
