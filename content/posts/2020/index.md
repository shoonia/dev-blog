---
publish: false
path: '/event-handling-of-repeater-item'
template: 'default'
date: '2020-05-08T12:00:00.000Z'
lang: 'en'
title: 'Corvid by Wix: Event handling of Repeater Item'
description: ''
author: 'Alexander Zaytsev'
image: ''
---

# Corvid by Wix: Event handling of Repeater Item

When I first started working with Corvid, I'd set handling functions of repeated items in repeater loop methods.

```js
$w('#repeater').onItemReady(($item, itemData, index) => {
  // it look easy
  $item('#repeatedButton').onClick((event) => {
    // in the moment of action, we have all the needed data
    console.log(
      $item('#repeatedContainer'),
      itemData,
      index,
    );
  });
});
```

## Use scope

Repeated Item Scope with [`$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at)

```js
$w('#repeater').onItemReady(($item, itemData, index) => {
  $item('#repeatedText').text = itemData.title;
});

// we use global selector `$w()`, it provides handling all repeated items.
$w('#repeatedButton').onClick((event) => {
  // the ID of the repeated item which an event was fired
  const itemId = event.context.itemId;
  // a repeater's data is stored as an array of objects
  const data = $w('#repeater').data;

  // create scope of the current repeated item
  const $item = $w.at(event.context);
  const itemData = data.find((item) => item._id === itemId);
  const index = data.findIndex((item) => item._id === itemId);

  // we have all the needed data
  console.log(
    $item('#repeatedContainer'),
    itemData,
    index,
  );
});
```

Now, we understand how to do more careful handling of events in the Repeater. Let's tidy up the selection scope logic and moving it to public file for reuse with different pages and Repeaters.

**public/util.js**
```js
export const createScope = (getData) => (event) => {
  // TODO:
}
```
**HOME Page Code**
```js
import { createScope } from 'public/util';

// Create a scope with a callback function that returns actual repeater data.
const useScope = createScope(() => {
  return $w('#repeater').data;
});

$w.onReady(() => {
  $w('#repeatedButton').onClick((event) => {
    // will accept the event and will return all data
    const { $item, itemData, index, data } = useScope(event);
  });
});
```

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

**HOME Page Code**
```js
import { createScope } from 'public/util';

const useScope = createScope(() => {
  return $w('#repeater').data;
});

$w.onReady(() => {
  // Sets static data
  $w('#repeater').onItemReady(($item, itemData) => {
    $item('#repeatedText').text = itemData.title;
  });

  $w('#repeatedButton').onClick((event) => {
    // returns all the needed data
    const { $item, itemData, index, data } = useScope(event);
  });
});
```

## Resources

- [Scope selector `$w.at(context)`](https://www.wix.com/corvid/reference/$w.html#at)
