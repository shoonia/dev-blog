---
permalink: '/ssr-and-warmup-data/'
date: '2022-07-19T12:00:00.000Z'
modified: '2022-07-19T12:00:00.000Z'
lang: 'en'
title: 'Velo: Server Side Rendering and Warmup Data APIs'
description: 'Learn how to optimize data receiving and reduce the Wix site load time'
image: '/assets/images/tftl.jpg'
---

# Velo: Server Side Rendering and Warmup Data APIs

*Learn how to optimize data receiving and reduce the Wix site load time*

![poster from the serial - tales from the loop](/assets/images/tftl.jpg)

In Velo, we use the [`$w.onReady()`](https://www.wix.com/velo/reference/$w/onready) method as a start point for interacting with the page. This method ensures that all the page elements have finished loading and we can interact with them. The life cycle of the Velo site includes two runs of the `$w.onReady()` method.

The first run of the `$w.onReady()` callback happens on the server-side when the server builds the HTML page. The server executes a Velo code and puts a result into HTML (if it's possible).

The second run goes on the client-side in the browser when a site page has loaded.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
    <a href="https://www.wix.com/velo/reference/wix-window/rendering-obj/introduction">Rendering</a>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/wix-window/rendering-obj/introduction">
    When possible, the rendering process is split in two in order to improve performance. The first cycle in the process happens in the server-side code and the second cycle happens in the client-side code. If not possible on the server-side, all rendering happens client-side.
  </blockquote>
</figure>

Let's playing with <abbr title="Server-side rendering">SSR</abbr> for understanding how it works.

For example, we have a below code:

```js
$w.onReady(function () {
  $w('#text1').text = 'Hello!';
});
```

Code will be executed on the server-side then a result will be added to the HTML page.

We can control the step of the render cycle with [`wixWindow.rendering.env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env).

`env` property returns <mark>backend</mark> when rendering on the server side and <mark>browser</mark> when rendering on the client side.

Let's update the code to see it. We create a string with env value and timestamp.

```js
import { rendering } from 'wix-window';

$w.onReady(function () {
  $w('#text1').text = `${rendering.env}: ${Date.now()}`;
});
```

Now, when we reload the page we can see that HTML content has <mark>backend</mark> value. When the page finished loading then we see the <mark>browser</mark> value, it's the second run of `$w.onReady()` on the client side.

<figure>
  <figcaption>
    <strong>SSR & browser runtime</strong>
  </figcaption>
  <video
    src="/assets/videos/ssr.mp4"
    type="video/mp4"
    preload="metadata"
    oncanplay="_this.playbackRate = 0.5; this.oncanplay = null_"
    controls
    loop
  />
</figure>

## Asynchronous operation

If we want to add <abbr title="Server-side rendering">SSR</abbr> with some async operation, we should wait for the promise to be fulfilled.

Let's have a look at an example. Creates a query for retrieving items from a database and prints them as a string.

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

As we can see, the <abbr title="Server-side rendering">SSR</abbr> doesn't work with any async operations. When we reload the page, we see a default text that the Text element contains in the editor.

**A site without server-side render with dynamic data**

<figure>
  <video
    src="/assets/videos/no-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    controls
    loop
  ></video>
  <figcaption>
    <em>
      I'm using the throttling of the network in Chrome DevTools to reduce Internet speed. It may be helpful for debugging.
    </em>
  </figcaption>
</figure>

It happened because `$w.onReady()` doesn't wait for a promise fulfilled on the server-side. The server doesn't wait for a query result and sends the HTML page with default content.

To fix is very simple, we should wait for a promise result. The `$w.onReady()` supports the async callback functions. Let's update the code with [`async/await`](https://javascript.info/async-await) operators.

```js
import wixData from 'wix-data';

$w.onReady(async function () {
  const data = await wixData.query('goods').find();

  $w('#text1').text = JSON.stringify(data.items);
});
```

Now, we can see the <abbr title="Server-side rendering">SSR</abbr> is starting to work. And the server has rendered the HTML page with the database items.

<figure>
  <figcaption>
    <strong>A site with server-side render for dynamic data</strong>
  </figcaption>
  <video
    src="/assets/videos/with-ssr.mp4"
    type="video/mp4"
    preload="metadata"
    controls
    loop
  />
</figure>

<aside>
❗ don't forget to turn off the throttling of the network after testing 😉
</aside>

### Long async calls slow down site performance

We should be careful using `$w.onReady()` with an async callback. Long async tasks slow down the render of the page.

```js
$w.onReady(async function () {
  // an async delay for 5 seconds
  await new Promise((r) => setTimeout(r, 5000));

  $w('#text1').text = Date.now().toString();
});
```

## Resources

- [Rendering `env` API](https://www.wix.com/velo/reference/wix-window/rendering-obj/env)
- [Warmup Data API](https://www.wix.com/velo/reference/wix-window/warmupdata-obj)
- [Velo: About the Page Rendering Process](https://support.wix.com/en/article/velo-about-the-page-rendering-process)

## Posts

- [Add hotkeys to Wix site](/hotkeys-custom-element/ )
- [Global type definitions](/global-type-definitions-in-velo/)
- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
