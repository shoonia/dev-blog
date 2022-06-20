---
permalink: '/TODO/'
date: '2022-06-20T12:00:00.000Z'
modified: '2022-06-20T12:00:00.000Z'
lang: 'en'
title: 'TODO'
description: 'TODO'
image: '/assets/images/velo.png'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=1"/>
'
---

# TODO

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window/rendering-obj/introduction">
    When possible, the rendering process is split in two in order to improve performance. The first cycle in the process happens in the server-side code and the second cycle happens in the client-side code. If not possible on the server-side, all rendering happens client-side.
  </blockquote>
</figure>

```js
import wixData from 'wix-data';

$w.onReady(function () {
  wixData.query('goods').find().then((data) => {
    $w('#text1').text = JSON.stringify(data.items);
  });
});
```

<figure>
  <figcaption>
    <strong>TODO</strong>
  </figcaption>
  <video
    src="/assets/posts/1/no-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728 "
    height="1080"
    controls
    loop
  />
</figure>

```js
import wixData from 'wix-data';

$w.onReady(async function () {
  await wixData.query('goods').find().then((data) => {
    $w('#text1').text = JSON.stringify(data.items);
  });
});
```

<figure>
  <figcaption>
    <strong>TODO</strong>
  </figcaption>
  <video
    src="/assets/posts/1/with-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728 "
    height="1080"
    controls
    loop
  />
</figure>




<figure>
  <figcaption>

  **View source code:**

  Press <kbd>Ctrl</kbd>+<kbd>U</kbd> (Windows) or <kbd>⌘</kbd>+<kbd>Option</kbd>+<kbd>U</kbd> (Mac).
  </figcaption>
  <img
    src="/assets/posts/1/view-source.jpg"
    alt="view source code"
    loading="lazy"
  />
</figure>

The `env` property returns <mark>"backend"</mark> when rendering on the server and <mark>"browser"</mark> when rendering on the client.

```js
import { warmupData, rendering } from 'wix-window';
import wixData from 'wix-data';

const getGoodsItems = async () => {
  const key = 'goods-items';

  if (rendering.env === 'backend') {
    const { items } = await wixData.query('goods').find();

    // Set the warmup data on the server
    warmupData.set(key, items);

    return items;
  }

  // Get the warmup data on the client-side
  return warmupData.get(key);
};

$w.onReady(async function () {
  const items = await getGoodsItems();

  $w('#text1').text = JSON.stringify(items);
});
```

<div class="_filetree">
  <div class="_filetree_folder _filetree_line">
    <strong>Public & Backend</strong>
  </div>
  <div class="_filetree_section _filetree_line">
    <img src="/assets/images/i/open.svg" alt=""/>
    Public
  </div>
  <div class="_filetree_folder _filetree_line">
    <img src="/assets/images/i/js.svg" alt=""/>
    warmupUtil.js
  </div>
  <div class="_filetree_section _filetree_line">
    <img src="/assets/images/i/open.svg" alt=""/>
    Backend
  </div>
  <div class="_filetree_folder _filetree_line">
    <img src="/assets/images/i/jsw.svg" alt=""/>
    database.jsw
  </div>
</div>

**backend/database.jsw**

```js
import wixData from 'wix-data';

export const getGoodsItems = async () => {
  const { items } = await wixData.query('goods').find();

  return items;
};
```

**public/warmupUtil.js**

```js
import { warmupData, rendering } from 'wix-window';

export const warmupUtil = async (key, func) => {
  if (rendering.env === 'backend') {
    const data = await func();

    warmupData.set(key, data);

    return data;
  }

  const data = warmupData.get(key);

  if (data == null) {
	  return data;
  }

  return func();
};
```

**public/warmupUtil.js**

```js
import { getGoodsItems } from 'backend/database';
import { warmupUtil } from 'public/warmupUtil';

$w.onReady(async function () {
  const items = await warmupUtil('goods-items', getGoodsItems);

  $w('#text1').text = JSON.stringify(items);
});
```

<aside>

```js
import { oneAsyncFunc, twoAsyncFunc, threeAsyncFunc } from 'backend/database';
import { warmupUtil } from 'public/warmupUtil';

// ❌ wrong approach!!
$w.onReady(async function () {
  const one = await warmupUtil('one-async-func', oneAsyncFunc);
  const two = await warmupUtil('two-async-func', twoAsyncFunc);
  const three = await warmupUtil('three-async-func', threeAsyncFunc);

  $w('#text1').text = JSON.stringify(one);
  $w('#text2').text = JSON.stringify(two);
  $w('#text3').text = JSON.stringify(three);
});
```

[`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

```js
import { oneAsyncFunc, twoAsyncFunc, threeAsyncFunc } from 'backend/database';
import { warmupUtil } from 'public/warmupUtil';

// ✅ parallel asynchronous execution
$w.onReady(async function () {
  const [one, two, three] = await Promise.all([
    warmupUtil('one-async-func', oneAsyncFunc),
    warmupUtil('two-async-func', twoAsyncFunc),
    warmupUtil('three-async-func', threeAsyncFunc),
  ]);

  $w('#text1').text = JSON.stringify(one);
  $w('#text2').text = JSON.stringify(two);
  $w('#text3').text = JSON.stringify(three);
});
```
</aside>

## Code Snippets

<details>
  <summary>
    <strong>warmupUtil.js</strong>
  </summary>

```js
import { warmupData, rendering } from 'wix-window';

/**
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} func
 * @returns {Promise<T>}
 */
export const warmupUtil = async (key, func) => {
  if (rendering.env === 'backend') {
    const data = await func();

    warmupData.set(key, data);

    return data;
  }

  const data = warmupData.get(key);

  if (data == null) {
    return data;
  }

  return func();
};
```
</details>

## Posts

- [Rendering `env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env)
- [Warmup Data API](https://www.wix.com/velo/reference/wix-window/warmupdata-obj)
