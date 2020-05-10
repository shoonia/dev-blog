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
But if you work with API or wixData, then you can have a lot of problems.

But now we consider this approach as an anti-pattern.

## Repeated Item Scope

In the documentation has examples how to use [repeated-item-scope](https://www.wix.com/corvid/reference/$w.Repeater.html#repeated-item-scope) selector with [`$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at).

```js
$w("#repeater").onItemReady(($item, itemData, index) => {
  $item('#repeatedText').text = itemData.title;
});

// we use global selector `$w()`, it provides handling all repeated items
$w("#repeatedButton").onClick((event) => {
  // the ID of the repeated item which an event was fired
  const itemId = event.context.itemId;
  // a repeater's data is stored as an array of objects
  const data = $w("#repeater").data;

  // create scope of the current repeated item
  const $item = $w.at(event.context);
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

Now, we understand how to do more careful handling of events in the Repeater. Let's separate logic out event handler for reuse with different Repeaters and pages.

## Create hook

Our flow will have next steps:

*Implementation*
```js
const createScope = (getData) => (event) => {
  // TODO: Implement hook
}
```

*initialize*

```js
// sets callback function which will return the repeater data
const useScope = createScope(() => {
  return $w("#repeater").data;
});
```

*using*

```js
// using with repeated items
$w("#repeatedButton").onClick((event) => {
  // returns all we need
  const { $item, itemData, index } = useScope(event);
});
```

1. Create a hook with `createScope(getData)` it will be work with specific Repeater. The argument `getData` it's a callback, it has to return Repeater's data.
2. The `createScope` will return a new function `useScope(event)` which have a connection with the specific Repeater data. The `useScope(event)` accepts an `event` object and return data of the current scope.

For the realization of `createScope(getData)` function, we create a public file `util.js`

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

Here we used the [getter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) for binding to data.

**HOME Page Code**

```js
import { createScope } from "public/util";

const useScope = createScope(() => {
  return $w("#repeater").data;
});

$w.onReady(() => {
  // sets static data
  $w("#repeater").onItemReady(($item, itemData) => {
    $item('#repeatedText').text = itemData.title;
  });

  $w("#repeatedButton").onClick((event) => {
    // returns all we need
    const { $item, itemData, index, data } = useScope(event);
  });
});
```

## Resources

- [Scope selector `$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at)
- [Global Scope & Repeated Item Scope Selectors](https://www.wix.com/corvid/reference/$w.Repeater.html#global-scope)
- [GitHub: repeater-scope](https://github.com/shoonia/repeater-scope)
