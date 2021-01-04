---
publish: true
path: '/side-effect-data-saving-methods'
template: 'default'
date: '2020-11-22T12:00:00.000Z'
modified: '2021-01-04T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Side effect wix-data saving methods'
description: 'The wix-data methods for saving data has a side effect that I have spent a few hours debugging. In this post, I share how it goes'
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/fd206f_828ed263e9c945b69d04dbf6e2328d9a~mv2.jpg/v2/fill/w_500,h_500/i.jpg'
---

# Velo by Wix: Side effect wix-data saving methods

*The wix-data methods for saving data has a side effect that I have spent a few hours debugging. In this post, I share how it goes*

<img
  src="https://static.wixstatic.com/media/fd206f_828ed263e9c945b69d04dbf6e2328d9a~mv2.jpg"
  width="775"
  height="410"
  alt="the picture from serials 'Tales From The Loop'"
/>

We have three methods for manipulation of the database collection that has the same side effect. I found this behavior when it broke my logic in the [data hook](https://support.wix.com/en/article/corvid-using-data-hooks).

The pasted `item` is mutating after any of these methods is done:

- [`wixData.insert("myCollection", item)`](https://www.wix.com/velo/reference/wix-data/insert)
- [`wixData.update("myCollection", item)`](https://www.wix.com/velo/reference/wix-data/update)
- [`wixData.save("myCollection", item)`](https://www.wix.com/velo/reference/wix-data/save)

So, consider the code example where we output to console a new item before and after inserting it into a collection.

```js
import wixData from 'wix-data';

(async () => {
  const item = { title: 'hello' };

  console.log(1, item);

  const result = await wixData.insert('notes', item);

  console.log(2, item);

  console.log(3, result === item);
})();
```

*In the console:*

```js
1 {"title":"hello"}

2 {"title":"hello","_createdDate":"2020-11-21T18:34:29.050Z","_updatedDate":"2020-11-21T18:34:29.050Z","_id":"6e616318-ffdb-4954-9529-84c6a63f5393"}

3 true
```

We can see above what, after inserting, the item is mutating it has new properties. And the method will return the same item which was passed.

`wixData.update()` and `wixData.save()` will have the same behavior.

## How it affects

In my case, I used a [data hook](https://support.wix.com/en/article/corvid-about-data-hooks) that first saves a new user to private collection (only for admins), and then it creates a new row for public members collection with part of open the user data.

**backend/data.js**

```js
export async function Members_afterInsert(item) {
  await wixData.insert('MembersPrivate', item);

  /**
   * Here I had a mutated item after inserting it into a Private database.
   */
}
```

I had a mutated item after inserting it into a Private database, and it created a bug.

For fixing, I have to copy the item for inserting. I use the [object spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
// Creates a copy of item
await wixData.insert('MembersPrivate', { ...item });
```

## Methods for multiple items

We also have methods that can work with a number of items. Let's consider three of these which use to save data:

- [`wixData.bulkInsert("myCollection", [item1, item2])`](https://www.wix.com/velo/reference/wix-data/bulkinsert)
- [`wixData.bulkUpdate("myCollection", [item1, item2])`](https://www.wix.com/velo/reference/wix-data/bulkupdate)
- [`wixData.bulkSave("myCollection", [item1, item2])`](https://www.wix.com/velo/reference/wix-data/bulksave)

We can get to repeat the experiment. These methods accept an array of items.

```js
import wixData from 'wix-data';

(async () => {
  const a = { title: 'a' };
  const b = { title: 'b' };

  console.log(1, a, b);

  const result = await wixData.bulkInsert('notes', [a, b]);

  console.log(2, a, b);

  console.log(3, result);
})();
```

*In the console:*

```js
1 {title: "a"} {title: "b"}

2 {title: "a"} {title: "b"}

3 {
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

Great, bulk methods work differently. They don't mutate the passed items and don't return the mutated items back. The successfully done bulk methods return the `Promise<WixDataBulkResult>` that contains the info about the changes.

## Conclusion

The understanding of how to work the platform is an important thing. If I catch the bugs that grow from a misunderstanding of some of the processes, then I prefer to spend time searching, experiments, and testing it.

When the platform is not a black box for you, this saves more time than you have spent learning it.

## Posts

- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [A tiny event-based state manager Storeon for Corvid.](/corvid-storeon/)
