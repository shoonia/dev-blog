---
permalink: '/ssr-and-warmup-data/'
date: '2022-06-20T12:00:00.000Z'
modified: '2022-06-20T12:00:00.000Z'
lang: 'en'
title: 'Velo: Server Side Rendering and Warmup Data APIs'
description: 'TODO'
image: '/assets/images/ne.jpg'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=1"/>
'
---

# Velo: Server Side Rendering and Warmup Data APIs

![art by Vitaliy Ostaschenko](/assets/images/ne.jpg)

In Velo, we use the [`$w.onReady()`](https://www.wix.com/velo/reference/$w/onready) method as a start point for interacting with the page. This method ensure that all the page elements have finished loading and we can interact with them. The lifecycle of the Velo site includes two runs of the `$w.onReady()` method.

The first run of `$w.onReady()` callback happening on the server-side when server build HTML page. The server is running the code and put result into HTML (if it's possible).

The second run is happening on the client-side in browser when page is loaded.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window/rendering-obj/introduction">
    When possible, the rendering process is split in two in order to improve performance. The first cycle in the process happens in the server-side code and the second cycle happens in the client-side code. If not possible on the server-side, all rendering happens client-side.
  </blockquote>
</figure>

Let's playing with <abbr title="Server-side rendering">SSR</abbr> for understanding how it works.

For example, we have the next code.

```js
$w.onReady(function () {
  $w('#text1').text = 'Hello!';
});
```

On the server this code will be executed and result will put to the HTML page. It doesn't matter what the text `'#text1'` component has in editor. It always will be `'Hello!'`

We can control the step of cycle with [`wixWindow.rendering.env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env).

The `env` property returns <mark>"backend"</mark> when rendering on the server and <mark>"browser"</mark> when rendering on the client.

Let's update the code for see it. We create a string with env value and timestamp.

```js
import { rendering } from 'wix-window';

$w.onReady(function () {
  $w('#text1').text = `${rendering.env}: ${Date.now()}`;
});
```

Now, when we reload the page we can see that HTML content has <mark>backend</mark> value. And when the page finished loading then we see the <mark>browser</mark> value (the second cycle).

<figure>
  <figcaption>
    <strong>SSR & browser runtime</strong>
  </figcaption>
  <video
    src="/assets/posts/1/ssr.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  />
</figure>

## Asynchronous operation

What about async operations, promises?

So, let's do a query request to a database and print result as a string.

```js
import wixData from 'wix-data';

$w.onReady(function () {
  wixData.query('goods').find().then((data) => {
    $w('#text1').text = JSON.stringify(data.items);
  });
});
```

When we reload the page then we see a default text that contain in editor element.

<figure>
  <figcaption>
    <strong>A site without server-side render for dynamic data</strong>
  </figcaption>
  <video
    src="/assets/posts/1/no-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  />
</figure>

```js
import wixData from 'wix-data';

$w.onReady(async function () {
  const data = await wixData.query('goods').find();

  $w('#text1').text = JSON.stringify(data.items);
});
```

<figure>
  <figcaption>
    <strong>A site with server-side render for dynamic data</strong>
  </figcaption>
  <video
    src="/assets/posts/1/with-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  />
</figure>

<aside>
❗ don't forget to turn off the throttling of the network after testing 😉
</aside>

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

## The Warmup Data API

[The Warmup Data API](https://www.wix.com/velo/reference/wix-window/warmupdata-obj)

```js
import { warmupData } from 'wix-window';

// Set data
warmupData.set('my-key', 'value');

// Get data
const data = warmupData.get('my-key');
```

```html
<!-- warmup data start -->
<script type="application/json" id="wix-warmup-data">
  { }
</script>
<!-- warmup data end -->
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
</div>

**public/warmupUtil.js**

```js
import { warmupData, rendering } from 'wix-window';

export const warmupUtil = async (key, func) => {
  // On the server-side render step
  if (rendering.env === 'backend') {
    // Get data
    const data = await func();

    // Set the warmup data on the server-side
    warmupData.set(key, data);

    return data;
  }

  // On the client-side

  // Get the warmup data on the client-side
  const data = warmupData.get(key);

  // Checking a cached data exist
  if (data) {
    return data;
  }

  // If we don't have cache data from the server,
  // then we do a backup call on the client
  return func();
};
```

**Page Code Tab**

```js
import { warmupUtil } from 'public/warmupUtil';

const getGoods = () => {
   return wixData.query('goods').find().then((data) => data.items);
};

$w.onReady(async function () {
  const items = await warmupUtil('goods-items', getGoods);

  $w('#text1').text = JSON.stringify(items);
});
```

## Parallel execution for a few async tasks

```js
// ❌ wrong approach!!
$w.onReady(async function () {
  const one = await warmupUtil('one-async-func', oneAsyncFunc);
  const two = await warmupUtil('two-async-func', twoAsyncFunc);
  const three = await warmupUtil('three-async-func', threeAsyncFunc);

  $w('#text1').text = JSON.stringify({ one, two, three });
});
```

[`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

```js
// ✅ parallel asynchronous execution
$w.onReady(async function () {
  const [one, two, three] = await Promise.all([
    warmupUtil('one-async-func', oneAsyncFunc),
    warmupUtil('two-async-func', twoAsyncFunc),
    warmupUtil('three-async-func', threeAsyncFunc),
  ]);

  $w('#text1').text = JSON.stringify({ one, two, three });
});
```

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

  if (data) {
    return data;
  }

  return func();
};
```
</details>

## Resources

- [Rendering `env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env)
- [Warmup Data API](https://www.wix.com/velo/reference/wix-window/warmupdata-obj)
- [Velo: About the Page Rendering Process](https://support.wix.com/en/article/velo-about-the-page-rendering-process)

## Posts

- [Reduce server-side calls using a caching mechanism](/cache-for-the-jsw-functions/)
- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
- [Query selector for child elements](/velo-query-selector-for-child-elements/)
