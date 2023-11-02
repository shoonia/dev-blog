---
permalink: '/corvid-imitate-hover-event/'
date: '2019-10-29T12:00:00.000Z'
modified: '2022-01-03T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Imitating hover event on repeater container'
description: "Velo API doesn't provide a hover event on the repeater container. In this post, we look at one way how we can imitate the hover event."
image: '/assets/images/repeater-small.png'
---

# Velo by Wix: Imitating hover event on repeater container

*Velo API doesn't provide a hover event on the repeater container. In this post, we look at one way how we can imitate the hover event.*

<svg viewBox="0 0 700 338" style="background-color:#000" aria-label="velo by wix"><path fill="#e5eaf8" d="m393.93 124.92-23.18 12.62-20.56-13.47 20.73-12.2a1.05 1.05 0 0 1 1.06 0l21.95 13.05Z"/><path fill="#cfcaf3" d="m350.19 124.07 20.56 13.47q-.15 12.92 1.2 25.87l-11.2-5.37-.75-.25c3.09-1.12-9.41-6.84-11.25-8.08 0-3.54-.86-23.22.29-25q.53-.82 1.15-.64Z"/><path fill="#a5a4de" d="M393.93 124.92q-.28 11.83-.22 22.34c.01 1.33 1.08 2.93-.75 3.95q-10.09 5.57-21.01 12.2-1.35-12.95-1.2-25.87l23.18-12.62Z"/><path fill="#e5eaf8" d="M348.75 149.71c1.84 1.24 14.34 6.96 11.25 8.08l-21.5 11.75q-1.34-.29-1.72-.55-9.93-6.8-21.37-11.09 10.74-7.38 22.39-13.63a1.24 1.21 44.8 0 1 1.15.01l9.8 5.43Z"/><path fill="#a5a4de" d="m360 157.79.75.25q-.13 11.61.35 23.21.07 1.83-1.47 2.68-10.04 5.52-20.54 11.94c-2.11-7.72-1.11-17.46-.83-25.43q.02-.51.24-.9l21.5-11.75Z"/><path fill="#cfcaf3" d="M315.41 157.9q11.44 4.29 21.37 11.09.38.26 1.72.55-.22.39-.24.9c-.28 7.97-1.28 17.71.83 25.43q-11.85-5.63-22.89-12.6a.94.92 16.1 0 1-.43-.76l-.36-24.61Z"/></svg>

## Motivation

We have a `$w.Repeater` component with items of users' cards. When we point with the mouse cursor over some item we want to change background color of this item to light blue color `#CCE4F7` and when the cursor moves off of item we want to return the initial white color.

For this, we're going to use two other events that provide repeater API:

- [`onMouseIn()`](https://www.wix.com/velo/reference/$w/element/onmousein) runs when the mouse pointer is moved onto the element.
- [`onMouseOut()`](https://www.wix.com/velo/reference/$w/element/onmouseout) runs when the mouse pointer is moved off of the element

Also, repeater items don't have property [`style.backgroundColor`](https://www.wix.com/velo/reference/$w/style/backgroundcolor) for changing the background color of an element. But we can use [`background.src`](https://www.wix.com/velo/reference/$w/background/background) property for changing the background image. So in this way, we're going to use a one-pixel image.

<a href="#" download="1x1_#cce4f7ff.png">
  Download: Here is one-pixel image
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjOPPk+38ACM4Dp1/0SeUAAAAASUVORK5CYII="
    alt="light blue pixel image"
    onload="this.closest('a').href = this.src"
    width="12"
    height="12"
  />
</a>

## Event handlers

To start with, set handlers to `onMouse{In/Out}` events. We will use one function for two events by repeaters containers. We declare the handler function above and pass the function's name as an argument to container methods.

```js
/**
 * @param {$w.MouseEvent} event
 */
const imitateHover = (event) => {
  // our handler for containers
}

$w.onReady(function () {
  $w('#container1').onMouseIn(imitateHover).onMouseOut(imitateHover); // set handlers
});
```

<aside>

  **Please pay attention**

  We don't nest any containers item into the repeater for adding handlers. Like here:

  ```js
  // ❌ In this way, each time when onItemReady starts
  // may set a new handler for containers
  $w('#repeater1').onItemReady(($item, itemData, index) => {
    $item('#container1').onMouseIn(imitateHover).onMouseOut(imitateHover);
  });
  ```
  We set globally our handler on all `#container1` with `$w()` selector. And it works well!

  More: [Event handling of Repeater Item](/event-handling-of-repeater-item/)
</aside>


## Imitate hover

We use one function for two events, therefore we need to listen to which type of event is going.  We're expecting two event types:

- `event.type === 'mouseenter'` when `onMouseIn()` is running.
- `event.type === 'mouseleave'` when `onMouseOut()` is running.

Let's see the code:

```js
/**
 * @param {$w.MouseEvent} event
 */
const imitateHover = (event) => {
  if (event.type === 'mouseenter') {
    console.log('we have mouseenter if onMouseIn() is running');
  }

  if (event.type === 'mouseleave') {
    console.log('we have mouseleave if onMouseOut() is running');
  }
};

$w.onReady(function () {
  $w('#container1').onMouseIn(imitateHover).onMouseOut(imitateHover);
});
```

The object `event` always will be consistent with the current container item, which we point mouse cursor. And we can change the `background.src` property of the container by `event.target`.

```js
// link to one pixel image
const HOVER_PNG = 'https://static.wixstatic.com/media/e3b156_df544ca8daff4e66bc7714ebc7bf95f1~mv2.png';

/**
 * @param {$w.MouseEvent} event
 */
const imitateHover = (event) => {
  // when the cursor over container then set image.
  if (event.type === 'mouseenter') {
    event.target.background.src = HOVER_PNG;
  }

  if (event.type === 'mouseleave') {
    // when the cursor is gone then remove the pixel image.
    event.target.background.src = '';
  }
}

$w.onReady(function () {
  $w('#container1').onMouseIn(imitateHover).onMouseOut(imitateHover);
});
```

Great! It works.

## One-pixel image

We used the direct link to the one-pixel image. The size of this image is only 70 bytes. For example, the link of this image has 82 chars length, it's 82 bytes. The link takes up more memory than the image. ¯\\\_(ツ)\_/¯

### data:URL

[Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), it's a protocol that allows embedded small files inline in documents as a string. It means we can convert a one-pixel PNG image to string and pass it to `background.src`.

We can create needed images by [1x1 PNG generator #cce4f7ff](https://shoonia.github.io/1x1/#cce4f7ff).

```js
// one-pixel image encoded to base64
const HOVER_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM88+R7PQAIUwMo5M6pSAAAAABJRU5ErkJggg==';

/**
 * @param {$w.MouseEvent} event
 */
const imitateHover = (event) => {
  if (event.type === 'mouseenter') {
    event.target.background.src = HOVER_PNG;
  }

  if (event.type === 'mouseleave') {
    event.target.background.src = '';
  }
};

$w.onReady(function () {
  $w('#container1').onMouseIn(imitateHover).onMouseOut(imitateHover);
});
```

The `data:URL` image is a little longer than the direct link for this image. And other reason to use `data:URL` with the small image we don't send HTTP request for fetching this image.

<figure>
  <figcaption>

  **Live Demo: Hover on repeater container**
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/imitate-hover-event-on-corvid"
    title="Velo by Wix: Imitating hover event on repeater container"
    height="510"
    scrolling="no"
  ></iframe>
</figure>

## Resources

- [Velo APIs](https://www.wix.com/velo/reference/api-overview/introduction)
- [Data URLs MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [1x1 PNG generator](https://shoonia.github.io/1x1/)
- [This article on medium.com](https://medium.com/@shoonia/corvid-by-wix-imitating-hover-event-on-repeater-container-a65f4b6e0301)
- [Live Demo](https://shoonia.wixsite.com/blog/imitate-hover-event-on-corvid)

## Posts

- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [Using HTML template to the better performance](/html-template-in-corvid/)
- [A tiny event-based state manager Storeon for Velo](/corvid-storeon/)
