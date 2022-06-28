---
permalink: '/ssr-and-warmup-data/'
date: '2022-06-20T12:00:00.000Z'
modified: '2022-06-20T12:00:00.000Z'
lang: 'en'
title: 'Velo: Server Side Rendering and Warmup Data APIs'
description: 'Optimizing data fetching and decrease of the time a Wix site loading'
image: '/assets/images/ne.jpg'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=1"/>
'
---

# Velo: Server Side Rendering and Warmup Data APIs

*Optimizing data fetching and decrease of the time a Wix site loading*

![The Three-Body Problem by Li chunlei on ArtStation](/assets/images/ne.jpg)

In Velo, we use the [`$w.onReady()`](https://www.wix.com/velo/reference/$w/onready) method as a start point for interacting with the page. This method ensure that all the page elements have finished loading and we can interact with them. The lifecycle of the Velo site includes two runs of the `$w.onReady()` method.

The first run of `$w.onReady()` callback happening on the server-side when server build HTML page. The server is running the code and put result into HTML (if it's possible).

The second run is happening on the client-side in the browser when a site page has loaded.

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

This code will be executed on the server-side and a result will be put into the HTML page. It doesn't matter what the text `'#text1'` component has in the editor. It always will be 'Hello!' on the client.

We can control the step of cycle with [`wixWindow.rendering.env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env).

The `env` property returns <mark>"backend"</mark> when rendering on the server and <mark>"browser"</mark> when rendering on the client.

Let's update the code to see it. We create a string with env value and timestamp.

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

A problem starts if we use an async operation in our code. So, let's try to do a request to a database and print the result as a string.

```js
import wixData from 'wix-data';

$w.onReady(function () {
  wixData.query('goods').find().then((data) => {
    $w('#text1').text = JSON.stringify(data.items);
  });
});
```

As we can see, the <abbr title="Server-side rendering">SSR</abbr> doesn't work with any async operations. When we reload the page then we see a default text that the Text element contains in the editor.

<figure>
  <figcaption>
  I'm using the throttling of the network in Chrome DevTools for reduce Internet speed. It may be helpful for debug.

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

It happened because `$w.onReady()` doesn't wait for a promise fulfilled on the server-side. In the code, we don't have any instructions for that. The server doesn't wait for a query result and sends the HTML page with default content. Our database query is fulfilled only in the client browser.

The fix is very simple, we should wait a promise result. The `$w.onReady()` supports the async callback functions. Let's update the code with [`async/await`](https://javascript.info/async-await) operators.

```js
import wixData from 'wix-data';

$w.onReady(async function () {
  const data = await wixData.query('goods').find();

  $w('#text1').text = JSON.stringify(data.items);
});
```

Now, we can see that the SSR starts to work. And the server has rendered the HTML page with data.

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

### Long async calls slow down site performance

We should be careful if we use an async callback in the `$w.onReady()` event handler. Long async tasks slow down the render of the page.

We can test it. In the below code, we add a delay of 5 seconds and see what happens.

```js
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

$w.onReady(async function () {
  // an async delay for 5 seconds
  await delay(5000);

  $w('#text1').text = Date.now().toString();
});
```

If we run this code, then we see that the server needed around 5 seconds to completely send the HTML page. And after the HTML page has loaded, we again wait for 5 seconds before seeing the result. The server and the client are waiting for the `$w.onReady()` to be fulfilled. It slows down page rendering on the server (5 sec) and on the client (again 5 sec).

<figure>
  <figcaption>
    <strong>Network inspector, time to load the HTML page</strong>
  </figcaption>
  <img
    src="/assets/posts/1/network-inspector.jpg"
    alt="chrome inspector"
    lading="lazy"
  />
</figure>

Just think about it. Maybe you don't need the SSR if your API works slow.

## The Warmup Data API

We know that the life cycle `$w.onReady()` runs two times.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window/warmupdata-obj">
    The Warmup Data API is used to optimize data loading for sites that render both on the server and in the browser, allowing costly data fetching operations to be done only once.
  </blockquote>
</figure>

The APIs of the `warmupData` are very similar to the storage APIs. It has two methods. We can set data by key in the server. And get the data by key on the client.

<figure>
  <figcaption>

  Velo: [The Warmup Data API](https://www.wix.com/velo/reference/wix-window/warmupdata-obj)
  </figcaption>

  ```js
  import { warmupData, rendering } from 'wix-window';

  // Set data on the backend
  if (rendering.env === 'backend') {
    warmupData.set('my-key', 'server data');
  }

  // Get data on the browser
  if (rendering.env === 'browser') {
    const data = warmupData.get('my-key'); // -> "server data"
  }
  ```
</figure>

Under the hood, the `warmupData` injects the data into the script tag on the server-side. And parse this data on the client-side.

<figure>
  <figcaption>
    <strong>SSR data injection in Wix site</strong>
  </figcaption>

  ```html
  <!-- warmup data start -->
  <script type="application/json" id="wix-warmup-data">
    { … }
  </script>
  <!-- warmup data end -->
  ```
</figure>

## Issues and solution

Alright, we want to optimize page loading using SSR with dynamic data.

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
