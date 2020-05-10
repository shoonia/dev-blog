---
publish: true
path: '/event-handling-of-repeater-item'
template: 'default'
date: '2020-05-08T12:00:00.000Z'
lang: 'en'
title: 'Corvid by Wix: Event handling of Repeater Item'
description: "In this post, we consider why we shouldn't nest event handler inside the Repeater loop and how we can escape it"
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_15f0ef95e2d84ebf8542a488260e3001~mv2.jpg/v2/fill/w_300,h_300/i.jpg'
---

# Corvid by Wix: Event handling of Repeater Item

*In this post, we consider why we shouldn't nest event handler inside the Repeater loop and how we can escape it.*

![poster of tales from the loop](https://static.wixstatic.com/media/e3b156_15f0ef95e2d84ebf8542a488260e3001~mv2.jpg)

At first sight, the adding event handling for repeated items looks easy.
You just handling events of repeated items inside Repeater loop methods there you have all needed data and scope with selector `$item()`.

```js
$w("#repeater").onItemReady(($item, itemData, index) => {
  // it look easy
  $item("#repeatedButton").onClick((event) => {
    // in the moment of action, we have all we need
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

My team and I consider this approach as an anti-pattern and don't use it more.
For the "static" Repeaters which fill up once and don't change anymore during a user session, this approach can be used.

If you would like to do dynamic fill up your Repeater and change its items, then let's see another way.

## Selector Scope

In the Corvid, we have two types of selector functions.

- [Global Scope Selectors](https://www.wix.com/corvid/reference/$w.Repeater.html#global-scope)
- [Repeated Item Scope Selectors](https://www.wix.com/corvid/reference/$w.Repeater.html#repeated-item-scope)

The Global Scope Selectors it's `$w()`. We can use it anywhere in the frontend part of Wix site.
If we use `$w()` with Repeater Items, then it changes all items

```js
// will change all repeater text
$w("#repeatedText").text = "new";
```

### Repeated Item Scope

We can get repeated-item-scope selector in a few ways.

**Popular** way, selector as the first argument inside methods [`.forEachItem()`](https://www.wix.com/corvid/reference/$w.Repeater.html#forEachItem), [`.forItems()`](https://www.wix.com/corvid/reference/$w.Repeater.html#forItems), and [`.onItemReady()`](https://www.wix.com/corvid/reference/$w.Repeater.html#onItemReady) functions.

**Deprecated** way, selector as the second argument in an event handler. It still works but you haven't to use it

```js
// 🙅‍♀️ DON'T USE IT 🙅‍♂️
$w("#repeatedButton").onClick((event, $item) => {
  // deprecated selector function (could be removed in the future)
  $item("#repeatedText").text = "new";
});
```

And with an event **context**. We can get the selector function with [`$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at).

```js
$w("#repeatedButton").onClick((event) => {
  // accepts an event context and
  // returns repeated items scope selector
  const $item = $w.at(event.context);

  $item("#repeatedText").text = "new";
});
```

Let's try to reproduce how we can use `$w.at()` instead of Repeater loop methods.

```js
// we use global selector `$w()`, it provides handling all repeated items
$w("#repeatedButton").onClick((event) => {
  // get the ID of the repeated item which fired an event
  const itemId = event.context.itemId;
  // get all repeater's data, it's stored as an array of objects
  const data = $w("#repeater").data;

  // get repeated item scope
  const $item = $w.at(event.context);
  // use the array methods to find the current item
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

Now, we know how to do more careful handling of events in the Repeater.
But this code not good enough for reuse.
Let's move the scope selector logic out event handler to the independent method.

## Create hook

Our flow will have next steps:

*#1 Implementation*

```js
// here will be all logic
const createScope = (getData) => (event) => {
  // TODO: Implement hook
}
```

*#2 initialize*

```js
// sets callback function which will return the repeater data
const useScope = createScope(() => {
  return $w("#repeater").data;
});
```

*#3 using*

```js
// using with repeated items
$w("#repeatedButton").onClick((event) => {
  // returns all we need
  const { $item, itemData, index } = useScope(event);
});
```

We create a hook with `createScope(getData)` it will be work with specific Repeater. The argument `getData` it's a callback, it has to return Repeater's data.

The `createScope` will return a new function `useScope(event)` which have a connection with the specific Repeater data. The `useScope(event)` accepts an `event` object and return data of the current scope.

For the realization of `createScope(getData)` function, we will create a public file `util.js`

We can get Repeater data with `getData()`, and we have the event context. All we need just return Scope selector and item data as an object. I will use getter to return itemData, index and data.

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
}
```

If you don't work with getter/setter syntax for property accessors you can look [here](https://javascript.info/property-accessors) how it works.

 Let's see how we can use the hook on the page.

**HOME Page Code**

```js
import { createScope } from "public/util";

const useScope = createScope(() => {
  return $w("#repeater").data;
});

$w.onReady(() => {
  $w("#repeater").onItemReady(($item, itemData) => {
    $item('#repeatedText').text = itemData.title;
  });

  $w("#repeatedButton").onClick((event) => {
    // returns all we need
    const { $item, itemData, index, data } = useScope(event);
  });
});
```

Now, we can reuse this hook with all Repeater in all site pages.

## Resources

- [Scope selector `$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at)
- [Global Scope & Repeated Item Scope Selectors](https://www.wix.com/corvid/reference/$w.Repeater.html#global-scope)
- [GitHub: repeater-scope](https://github.com/shoonia/repeater-scope)
- [EventContext](https://www.wix.com/corvid/reference/$w.Event.html#EventContext)
- [Property getters and setters](https://javascript.info/property-accessors)
