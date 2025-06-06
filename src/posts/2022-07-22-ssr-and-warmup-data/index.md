---
permalink: '/ssr-and-warmup-data/'
date: '2022-07-22T12:00:00.000Z'
modified: '2024-01-15T12:00:00.000Z'
lang: 'en'
title: 'Velo: Server Side Rendering and Warmup Data APIs'
description: 'Learn how to optimize data retrieval and reduce the Wix site load time'
image: '/assets/images/tftl.jpg'
---

# Velo: Server Side Rendering and Warmup Data APIs

*Learn how to optimize data retrieval and reduce the Wix site load time*

![a poster for the TV show "Tales from the Loop"](/assets/images/tftl.jpg)

In Velo, we use the [`$w.onReady()`](https://dev.wix.com/docs/velo/velo-only-apis/$w/on-ready) method as a starting point for interacting with the page. This method ensures that all the page elements have finished loading and we can interact with them. The lifecycle of the Velo site includes two runs of the `$w.onReady()` method.

The first run of the `$w.onReady()` callback happens on the server-side when the server builds the HTML page. The server executes Velo code and puts a result into HTML (if it's possible).

The second run occurs on the client-side in the browser after a site page has loaded.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
    <a href="https://www.wix.com/velo/reference/wix-window-frontend/rendering/introduction">Rendering</a>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window-frontend/rendering/introduction">
    When possible, the rendering process is split in two in order to improve performance. The first cycle in the process happens in the server-side code and the second cycle happens in the client-side code. If not possible on the server-side, all rendering happens client-side.
  </blockquote>
</figure>

Let's playing with <abbr title="Server-side rendering">SSR</abbr> for understanding how it works.

For example, we have the below code:

```js
$w.onReady(function () {
  $w('#text1').text = 'Hello!';
});
```

Code will be executed on the server-side, then a result will be added to the HTML page. The page will then be sent to the client-side with the inserted data.

## Rendering API

We can control the step of the render cycle with [`wixWindow.rendering.env` API](https://dev.wix.com/docs/velo/apis/wix-window-frontend/rendering/introduction).

`env` property returns <mark>backend</mark> when rendering on the server-side and <mark>browser</mark> when rendering on the client-side.

Let's update the code to see it. It's a string with env value and timestamp.

```js
import { rendering } from 'wix-window-frontend';

$w.onReady(function () {
  $w('#text1').text = `${rendering.env}: ${Date.now()}`;
});
```

Now, when we reload the page we can see that HTML content has <mark>backend</mark> value. When the page finished loading, then we see the <mark>browser</mark> value, it's the second run of `$w.onReady()` on the client-side that updates the value of text.

<figure>
  <figcaption>
    <strong>SSR & browser runtime</strong>
  </figcaption>
  <video
    src="/assets/videos/ssr.mp4"
    preload="metadata"
    width="1728"
    height="1080"
    oncanplay="this.playbackRate = 0.5; this.oncanplay = null"
    controls
    loop
  />
</figure>

It looks easy.

## Asynchronous operation

What about async operations?

If we want to add <abbr title="Server-side rendering">SSR</abbr> with some async operation, we should wait for the promise to be [fulfilled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#:~:text=A%20Promise%20is%20in,that%20the%20operation%20failed.).

Let's have a look at an example. Create a query for retrieving items from a database and print them as a string.

```js
import wixData from 'wix-data';

$w.onReady(function () {
  // Async request to database
  wixData.query('goods').find()
    .then((data) => {
      $w('#text1').text = JSON.stringify(data.items);
    });
});
```

As we can see, the <abbr title="Server-side rendering">SSR</abbr> doesn't work with any async operations. When we reload the page, we see a default text that the Text element contains in the editor. And after a while, we see database items. It's the second run of the `$w.onReady()` callback on the client-side.

**A site without server-side render with dynamic data**

<figure>
  <video
    src="/assets/videos/no-ssr.mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  ></video>
  <figcaption>
    <em>
      I'm using the network throttling feature in Chrome DevTools to reduce internet speed. It may be helpful for debugging.
    </em>
  </figcaption>
</figure>

It happened because `$w.onReady()` doesn't wait for a promise to be fulfilled on the server-side. The server doesn't wait for a query result and sends the HTML page with default content.

To fix it is very simple, we should wait for a promise result. The `$w.onReady()` supports the async callback functions. Let's update the code with [`async/await`](https://javascript.info/async-await) operators.

```js
import wixData from 'wix-data';

$w.onReady(async function () {
  const data = await wixData.query('goods').find();

  $w('#text1').text = JSON.stringify(data.items);
});
```

Now, we can see the <abbr title="Server-side rendering">SSR</abbr> starts to work. And the server has rendered the HTML page with the database items.

<figure>
  <figcaption>
    <strong>A site with server-side render for dynamic data</strong>
  </figcaption>
  <video
    src="/assets/videos/with-ssr.mp4"
    preload="metadata"
    width="1728"
    height="1080"
    controls
    loop
  />
</figure>

<aside>
❗ Don't forget to turn off the network throttling after testing 😉
</aside>

### Long async calls slow down site performance

We should be careful using `$w.onReady()` with an async callback. Long async tasks slow down the render of the page.

For example, we add a timeout promise with a delay of 5 seconds into the callback.

```js
$w.onReady(async function () {
  // a delay for 5 seconds
  await new Promise((r) => setTimeout(r, 5000));

  $w('#text1').text = Date.now().toString();
});
```

If we run this code, we will see that the server will wait for 5 seconds to complete. And after the HTML page has loaded on the client, we will again wait for 5 seconds before seeing the result.

We wait twice for the promise to be fulfilled on the server and the client.

<figure>
  <img
    src="/assets/images/network-inspector.jpg"
    alt="chrome network inspector"
    loading="lazy"
  />
  <figcaption>
    <em>
      Network inspector, timing to load the HTML page from the server with a delay of 5 seconds
    </em>
  </figcaption>
</figure>

## The Warmup Data API

Using the Warmup Data API, we are able to transfer data with a page code from the server and read this data on the client side.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window-frontend/warmupdata">
    The Warmup Data API is used to optimize data loading for sites that render both on the server and in the browser, allowing costly data fetching operations to be done only once.
  </blockquote>
</figure>

<figure>
  <figcaption>

  Velo: [The Warmup Data API](https://www.wix.com/velo/reference/wix-window-frontend/warmupdata) example
  </figcaption>

  ```js
  import { warmupData, rendering } from 'wix-window-frontend';

  // Set data on the server-side
  if (rendering.env === 'backend') {
    warmupData.set('my-key', 'server data');
  }

  // Get data on the client-side
  if (rendering.env === 'browser') {
    const data = warmupData.get('my-key');

    console.log(data); // -> "server data"
  }
  ```
</figure>

We can use the Warmup Data to reduce requests to a database. We save the query response to `warmupData` on the server and read it on the client without additional database requests.

### Implement Warmup Data util function

We'll implement a feature that will enable server-side rendering and use the Warmup Data to prevent a second data request on the client-side, reducing the waiting time.

Create a file for util function.

**Add file to public section on the sidebar**

<div class="filetree" role="img" aria-label="velo sidebar">
  <div class="filetree_tab filetree_row">
    <strong>Public & Backend</strong>
  </div>
  <div class="filetree_title filetree_row">
    <img src="/assets/images/i/open.svg" alt=""/>
    Public
  </div>
  <div class="filetree_tab filetree_row">
    <img src="/assets/images/i/js.svg" alt=""/>
    warmupUtil.js
  </div>
</div>

It is a wrapper function. It has two arguments:

<dl>
  <dt>
    First argument - <em>key</em>
  </dt>
  <dd>It's a unique key corresponding to the data for the Warmup Data.</dd>
  <dt>
    Second argument - <em>func</em>
 </dt>
  <dd>It's an async function whose result we want to use with the the Warmup Data.</dd>
</dl>

**public/warmupUtil.js**

```js
import { warmupData, rendering } from 'wix-window-frontend';

export const warmupUtil = async (key, func) => {
  // On the server-side
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

  // If we don't have cached data from the server,
  // then we do a backup call on the client
  return func();
};
```

On the server, it waits for the asynchronous function result and sets it to the Warmup Data.

On the client, it uses data from the Warmup Data. If it has no data (due to some glitch on the server), it will call *func* on the client.

## Parallel execution for a few async tasks

We should remember the `$w.onReady()` effect of page loading. If we want to use a few async functions in `$w.onReady()` callback, we should avoid using them in a queue one by one.

For example, if each of these async functions executes in 100 milliseconds, the `$w.onReady()` will need to wait for 300 milliseconds for the complete execution of all of them.

```js
// ❌ wrong approach!!
$w.onReady(async function () {
  const one = await warmupUtil('one-async-func', oneAsyncFunc); // ⏳ 100 ms
  const two = await warmupUtil('two-async-func', twoAsyncFunc); // ⏳ 100 ms
  const three = await warmupUtil('three-async-func', threeAsyncFunc); // ⏳ 100 ms

  // ⏳ wait one by one (100 ms * 3) = 300 ms

  $w('#text1').text = JSON.stringify({ one, two, three });
});
```

We are able to aggregate a bunch of promises with [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), execute them in parallel, and wait until all of them are ready.

```js
// ✅ parallel asynchronous execution
$w.onReady(async function () {
  const [one, two, three] = await Promise.all([
    warmupUtil('one-async-func', oneAsyncFunc),
    warmupUtil('two-async-func', twoAsyncFunc),
    warmupUtil('three-async-func', threeAsyncFunc),
  ]);

  // ⏳ wait 100 ms. Parallel execution of all promises

  $w('#text1').text = JSON.stringify({ one, two, three });
});
```

## Code Snippets

Here is a code snippet with JSDoc annotations, and an example of its use.

<details>
  <summary>
    <strong>public/warmupUtil.js</strong>
  </summary>

```js
import { warmupData, rendering } from 'wix-window-frontend';

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
<details>
  <summary>
    <strong>Page Code Tab</strong>
  </summary>

```js
import { warmupUtil } from 'public/warmupUtil';

const getGoods = async () => {
   const { items } = await wixData.query('goods').find();

   return items;
};

$w.onReady(async function () {
  const items = await warmupUtil('goods-items', getGoods);

  $w('#text1').text = JSON.stringify(items);
});
```
</details>

## Resources

- [Rendering `env` API](https://dev.wix.com/docs/velo/apis/wix-window-frontend/rendering/introduction)
- [Warmup Data API](https://dev.wix.com/docs/velo/apis/wix-window-frontend/warmup-data/introduction)
- [Velo: About the Page Rendering Process](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/frontend-code/page-rendering/about-the-page-rendering-process)

## Posts

- [Add hotkeys to Wix site](/hotkeys-custom-element/ )
- [Global type definitions](/global-type-definitions-in-velo/)
- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
