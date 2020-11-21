---
publish: true
path: '/side-effect-data-saving-methods'
template: 'default'
date: '2020-11-21T12:00:00.000Z'
lang: 'en'
title: 'Corvid by Wix: Side effect wix-data saving methods'
description: 'The wix-data methods for saving data has a side effect that I have spent a few hours debugging. In this post, I want to share how it goes'
author: 'Alexander Zaytsev'
image: ''
---

# Corvid by Wix: Side effect wix-data saving methods

*The wix-data methods for saving data has a side effect that I have spent a few hours debugging. In this post, I want to share how it goes*

We have three methods for manipulation of an item in the database collection that has a side effect.

- [`wixData.insert("myCollection", toInsert)`](https://www.wix.com/corvid/reference/wix-data/insert)
- [`wixData.update("myCollection", toUpdate)`](https://www.wix.com/corvid/reference/wix-data/update)
- [`wixData.save("myCollection", toSave)`](https://www.wix.com/corvid/reference/wix-data/save)


```js
import wixData from 'wix-data';

(async () => {
  const item = { title: 'hello' };

  console.log(1, item);

  await wixData.insert('notes', item);

  console.log(2, item);
})();
```

*In the console:*

```js
1 {"title":"hello"}

2 {"title":"hello","_createdDate":"2020-11-21T18:34:29.050Z","_updatedDate":"2020-11-21T18:34:29.050Z","_id":"6e616318-ffdb-4954-9529-84c6a63f5393"}
```

```js
import wixData from 'wix-data';

(async () => {
  const item = { title: 'hello' };

  const result = await wixData.insert('notes', item);

  console.log(result === item); // true
})();
```

## Methods for multiple items

We also have methods that can work with a number of items in a collection. Let's consider three of these which use for saving data

- [`wixData.bulkInsert("myCollection", [toInsert1, toInsert2])`](https://www.wix.com/corvid/reference/wix-data/bulkinsert)
- [`wixData.bulkUpdate("myCollection", [toUpdate1, toUpdate2])`](https://www.wix.com/corvid/reference/wix-data/bulkupdate)
- [`wixData.bulkSave("myCollection", [toSave1, toSave2])`](https://www.wix.com/corvid/reference/wix-data/bulksave)

We can get to repeat the experiment. These methods accept an array of items.

```js
import wixData from 'wix-data';

(async () => {
  const a = { title: 'a' };
  const b = { title: 'b' };

  console.log(1, a, b);

  await wixData.bulkInsert('notes', [a, b]);

  console.log(2, a, b);
})();
```

*In the console:*

```js
1 {title: "a"} {title: "b"}

2 {title: "a"} {title: "b"}
```

Bulk methods work differently. They don't mutate the accept items and don't return the items back. The successful results of the bulk methods return the `Promise<WixDataBulkResult>`

```js
// WixDataBulkResult

{
  errors: [],
  inserted: 2,
  insertedItemIds: [
    "8e518e07-5ba9-46bf-8db0-b9231c6f5926",
    "4d90b85a-8449-4213-978f-ef0f8bec275b"
  ],
  length: 2,
  skipped: 0,
  updated: 0,
  updatedItemIds: [],
}
```

## Posts

- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [A tiny event-based state manager Storeon for Corvid.](/corvid-storeon/)
