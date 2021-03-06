---
publish: true
path: '/corvid-imitate-hover-event'
template: 'default'
date: '2019-10-29T12:00:00.000Z'
modified: '2021-01-16T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Imitating hover event on repeater container'
description: "Velo API doesn't provide a hover event on the repeater container. In this post, we look at one way how we can imitate the hover event."
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_a9f6621c175946b8a41f7d349d3311ed~mv2.png'
---

# Velo by Wix: Imitating hover event on repeater container

*Velo API doesn't provide a hover event on the repeater container. In this post, we look at one way how we can imitate the hover event.*

<img
  src="https://static.wixstatic.com/media/e3b156_4dbd2d10726340d48df87c9526939b89~mv2.jpg"
  width="700"
  height="338"
  alt="Velo by Wix"
  crossorigin="anonymous"
/>

## Motivation

We have a `$w.Repeater` component with items of users' cards. When we point with the mouse cursor over some item we want to change background color of this item to light blue color `#CCE4F7` and when the cursor moves off of item we want to return the initial white color.

For this, we're going to use two other events that provide repeater API:

- [`onMouseIn()`](https://www.wix.com/velo/reference/$w/element/onmousein) runs when the mouse pointer is moved onto the element.
- [`onMouseOut()`](https://www.wix.com/velo/reference/$w/element/onmouseout) runs when the mouse pointer is moved off of the element

Also, repeater items don't have property [`style.backgroundColor`](https://www.wix.com/velo/reference/$w/style/backgroundcolor) for changing the background color of an element. But we can use [`background.src`](https://www.wix.com/velo/reference/$w/background/background) property for changing the background image. So in this way, we're going to use a one-pixel image.

[Here is one-pixel image](https://static.wixstatic.com/media/e3b156_df544ca8daff4e66bc7714ebc7bf95f1~mv2.png)

## Event handlers

To start with, set handlers to `onMouse{In/Out}` events. We will use one function for two events by repeaters containers. We declare the handler function above and pass the function's name as an argument to container methods.

```js
function imitateHover(event) {
  // our handler for containers
}

$w.onReady(function () {
  $w("#container1").onMouseIn(imitateHover); // set handler
  $w("#container1").onMouseOut(imitateHover);
});
```

Please pay attention, we don't nest any containers item into the repeater for adding handlers. Like here:

```js
// ❌ In this way, each time when onItemReady starts
// may set a new handler for containers
$w("#repeater1").onItemReady( ($item, itemData, index) => {
  $item("#container1").onMouseIn(imitateHover);
  $item("#container1").onMouseOut(imitateHover);
});
```

We set globally our handler on all `#container1` with `$w()` selector. And it works well!

## Imitate hover

We use one function for two events, therefore we need to listen to which type of event is going.  We're expecting two event types:

- `event.type === "mouseenter"` when `onMouseIn()` is running.
- `event.type === "mouseleave"` when `onMouseOut()` is running.

Let's see the code:

```js
function imitateHover(event) {
  if (event.type === "mouseenter") {
    console.log("we have mouseenter if onMouseIn() is running");
  }

  if (event.type === "mouseleave") {
    console.log("we have mouseleave if onMouseOut() is running");
  }
}

$w.onReady(function () {
  $w("#container1").onMouseIn(imitateHover);
  $w("#container1").onMouseOut(imitateHover);
});
```

The object `event` always will be consistent with the current container item, which we point mouse cursor. And we can change the `background.src` property of the container by `event.target`.

```js
// link to one pixel image
const HOVER_PNG = "https://static.wixstatic.com/media/e3b156_df544ca8daff4e66bc7714ebc7bf95f1~mv2.png";

function imitateHover(event) {
  // when the cursor over container then set image.
  if (event.type === "mouseenter") {
    event.target.background.src = HOVER_PNG;
  }

  if (event.type === "mouseleave") {
    // when the cursor is gone then remove the pixel image.
    event.target.background.src = "";
  }
}

$w.onReady(function () {
  $w("#container1").onMouseIn(imitateHover);
  $w("#container1").onMouseOut(imitateHover);
});
```

Great! It works: [DEMO](https://shoonia.wixsite.com/blog/imitate-hover-event-on-corvid)

## One-pixel image

We used the direct link to the one-pixel image. The size of this image is only 70 bytes. For example, the link of this image has 82 chars length, it's 82 bytes. The link takes up more memory than the image. ¯\\\_(ツ)\_/¯

### data:URL

[Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), it's a protocol that allows embedded small files inline in documents as a string. It means we can convert a one-pixel PNG image to string and pass it to `background.src`.

We can create needed images by [1x1 PNG generator #cce4f7ff](https://shoonia.github.io/1x1/#cce4f7ff).

```js
// one-pixel image encoded to base64
const HOVER_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM88+R7PQAIUwMo5M6pSAAAAABJRU5ErkJggg==';

function imitateHover(event) {
  if (event.type === "mouseenter") {
    event.target.background.src = HOVER_PNG;
  }

  if (event.type === "mouseleave") {
    event.target.background.src = "";
  }
}

$w.onReady(function () {
  $w("#container1").onMouseIn(imitateHover);
  $w("#container1").onMouseOut(imitateHover);
});
```

The `data:URL` image is a little longer than the direct link for this image. And other reason to use `data:URL` with the small image we don't send HTTP request for fetching this image.

## Resources

- [Velo APIs](https://www.wix.com/velo/reference/api-overview/introduction)
- [Data URLs MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [1x1 PNG generator](https://shoonia.github.io/1x1/)
- [This article on medium.com](https://medium.com/@shoonia/corvid-by-wix-imitating-hover-event-on-repeater-container-a65f4b6e0301)

## Posts

- [Event handling of Repeater Item](/event-handling-of-repeater-item)
- [Using HTML template to the better performance](/html-template-in-corvid)
- [A tiny event-based state manager Storeon for Velo](/corvid-storeon)
