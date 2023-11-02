---
permalink: '/corvid-storeon/'
date: '2019-12-21T12:00:00.000Z'
modified: '2021-04-25T12:00:01.000Z'
lang: 'en'
title: 'A tiny event-based state manager Storeon for Velo'
description: 'In this article, we explain how to manage an state in Velo with a light-weight and robust solution: Storeon, an event-based state manager'
image: 'https://static.wixstatic.com/media/e3b156_d4b49b51e9cd40a5ac38f7a4cfa23d39~mv2.png/v2/fill/w_300,h_300/cs.png'
---

<p>
  <small>
    <time datetime="2021-01-06T12:00:00.000Z">Update: Jan 6, 2021</time>
    <a href="https://www.youtube.com/watch?v=iAWEOpkUz-U">
      Corvid changed name to Velo.
    </a>
  </small>
</p>

# A tiny event-based state manager Storeon for Velo

*In this article, we explain how to manage an state in Velo with a light-weight and robust solution: Storeon, an event-based state manager.*

<svg aria-label="storeon-velo" aria-hidden="true" style="background-color:#cce4f7" viewBox="0 0 1280 640" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#3536e5" d="M301.5 320c0 93.321 76.171 167.5 172 167.5s172-74.179 172-167.5-76.171-167.5-172-167.5c-54.057 0-100.743 23.929-132.686 62.214 36.857 7.179 63.886 26.322 90.915 74.179 31.942 55.036 24.571 95.714 44.228 95.714 27.029 0 31.943-81.357 39.314-100.5h41.772c-2.457 11.964-22.114 93.322-29.486 107.679-14.743 26.321-34.4 31.107-49.143 31.107-39.314 0-49.143-31.107-56.514-55.036-7.371-23.928-14.743-43.071-24.571-59.821-34.4-62.215-78.629-57.429-81.086-57.429C306.414 272.143 301.5 296.071 301.5 320z"/><use x="261" y="-201" transform="matrix(.61 0 0 .6 248 291)" xlink:href="#_a"/><defs><symbol id="_a" viewBox="0 0 170 151"><defs><linearGradient y2="100%" y1="0" x2="50%" x1="50%" id="_b"><stop stop-color="#ff003d"/><stop stop-color="#ffc300" offset="100%"/></linearGradient><linearGradient y2="96.122%" y1="45.072%" x2="13.356%" x1="38.563%" id="_f"><stop stop-color="#fcf53c"/><stop stop-color="#f8a21c" offset="100%"/></linearGradient><filter filterUnits="objectBoundingBox" y="-24%" x="-21%" height="147%" width="142%" id="_e"><feGaussianBlur stdDeviation="10"/></filter><path d="M34 21h110v90H34V21z" id="_c"/></defs><path d="M45 111C22.909 111 5 93.091 5 71s17.909-40 40-40c.245 0 .49.002.734.007C53.21 12.812 71.109 0 92 0c27.614 0 50 22.386 50 50 0 .79-.018 1.575-.055 2.356C154.145 56.162 163 67.547 163 81c0 16.569-13.431 30-30 30H45z" fill="url(#_b)"/><mask id="_d"><use xlink:href="#_c"/></mask><path mask="url(#_d)" filter="url(#_e)" d="M74 45h39L91 82h26l-44.711 46.947 91.034.109L165.096 8l2.965 126.349H25l39.247-5.293L77 101H54l20-56z" fill-opacity=".5" fill="#800"/><path d="M74 40h39L91 77h26l-60 63 20-44H54l20-56z" fill="url(#_f)"/></symbol></defs></svg>

## Motivation

In the article, [“State management in Velo”](https://shahata.medium.com/state-management-in-corvid-2ebfa8740abd), Shahar Talmi brings up a question about controlling app states in Velo. If you’re not familiar with Velo, it’s a development platform running on Wix that allows you to quickly and easily develop web applications.

Accurately controlling the state of any app is a really big problem. If you have many component dependencies or need to handle constant user interactions, you're going to suffer a bit when you want to eventually add a new feature or scale your application.

In this article, I share my solution — a very tiny library called [Storeon](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes) (it’s only 180 bytes) that features an easy interface. So, I wrote a wrapper for integration with Velo. As a result, we have the state manager [storeon-velo](https://github.com/shoonia/storeon-velo), and it’s less than 90 lines of code.

## How it works

We will create a traditional study app with counters. I will use two counters to help provide a better demonstration.

<figure>
  <figcaption>

  At first, we need to install the library from [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)
  </figcaption>
  <div class="filetree" role="img" aria-label="Package Manager panel in Wix editor, installing storeon-velo">
    <div class="filetree_tab filetree_row">
      <strong>Code Packages</strong>
    </div>
    <div class="filetree_title filetree_row">
      <img src="/assets/images/i/open.svg" alt=""/>
      npm
    </div>
    <div class="filetree_tab filetree_row">
      <img src="/assets/images/i/npm.svg" alt=""/>
      storeon-velo (v.2.1.0)
    </div>
  </div>
</figure>

and create one more file for store initialization in the **public** folder.

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
    store.js
  </div>
</div>

We will write our business logic in `public/store.js`.

Storeon's state is always an object; it canʼt be anything else. Itʼs a small limitation and not too important to us, but we have to remember it.

**public/store.js**

```js
// The store should be created with createStoreon() function.
// It accepts a list of the modules.
import { createStoreon } from 'storeon-velo';

// Each module is just a function,
// which will accept a store and bind their event listeners.
const counterModule = (store) => {
  // @init will be fired in createStoreon.
  // The best moment to set an initial state.
  store.on('@init', () => ({ x: 0, y: 0 }));

  // Reducers returns only changed part of the state
  // You can dispatch any other events.
  // Just do not start event names with @.
  store.on('INCREMENT_X', (state) => ({ x: state.x + 1 }));
  store.on('DECREMENT_X', (state) => ({ x: state.x - 1 }));

  store.on('INCREMENT_Y', (state) => ({ y: state.y + 1 }));
  store.on('DECREMENT_Y', (state) => ({ y: state.y - 1 }));
}

// createStoreon() returns 4 methods to work with store
export const {
  getState, // <- will return current state.
  dispatch, // <- will emit an event with optional data.
  connect, // <- connect to state by property key.
  connectPage, // <- wrapper around $w.onReady()
} = createStoreon([counterModule]);
```

So, we created a store in the public folder and exported from there with four methods. In the second part, we will create our UI, and we will write logic to change the state.

Letʼs add two text elements to display our counter value, and four buttons for event increments/decrements.

<img
  src="https://static.wixstatic.com/media/e3b156_62643a01cf9843439a560fab7dde566a~mv2.png"
  alt="Example: Wix Editor layouts with two counters for increment and decrement"
  width="1398"
  height="494"
  loading="lazy"
/>

Of course, we have to import the store methods from the public file to the page's code.

```js
import { getState, dispatch, connect, connectPage } from 'public/store';
```

With `connect("key", callback)`, we can subscribe to any store properties, and the callback function will be run when the page is loaded and each time when the listed property changes.

The `connectPage(callback)` is a wrapper around the `$w.onReady(callback)`. With `dispatch(event, [data])`, we will emit events.

**Page Code**

```js
import { getState, dispatch, connect, connectPage } from 'public/store';

// Connect to property "x".
// The callback function will be run when the page loads ($w.onReady())
// and each time when property "x" would change.
connect('x', (state) => {
  console.log('counter X is changed', state);

  $w('#textX').text = String(state.x);
});

// Connect to "y"
connect('y', (state) => {
  console.log('counter Y is changed', state);

  $w('#textY').text = String(state.y);
});

// Wrapper around $w.onReady()
// The callback function will be run once.
connectPage((state) => {
  // Here we also have an object with initial state
  console.log('onReady runs', state);

  // X counter events
  $w('#buttonIncX').onClick(() => {
    dispatch('INCREMENT_X');
  });

  $w('#buttonDecX').onClick(() => {
    dispatch('DECREMENT_X');
  });

  // Y counter events
  $w('#buttonIncY').onClick(() => {
    dispatch('INCREMENT_Y');
  });

  $w('#buttonDecY').onClick(() => {
    dispatch('DECREMENT_Y');
  });
});
```

**[Live Demo](https://www.wix.com/alexanderz5/storeon-velo)**

## Modules

The function, `createStoreon(modules)`, accepts a list of modules. We can create different functions to split business logic into our app. Letʼs see a few examples:

Synchronization the App state with the `wix-storage` memory API:

```js
// https://www.wix.com/velo/reference/wix-storage/memory
import { memory } from 'wix-storage';

export const memoryModule = (store) => {
  // @changed will be fired every when event listeners changed the state.
  // It receives object with state changes.
  store.on('@changed', (state) => {
    memory.setItem('key', JSON.stringify(state));
  });
}
```

Tracking an event to external analytics tools with `wixWindow.trackEvent()`:

```js
import wixWindow from 'wix-window';

export const trackEventModule = (store) => {
  // @dispatch will be fired on every `dispatch(event, [data])` call.
  // It receives an array with the event name and the event’s data.
  // Can be useful for debugging.
  store.on('@dispatch', (state, [event, data]) => {
    if (event === 'product/add') {
      // Sends a tracking event to external analytics tools.
      wixWindow.trackEvent('CustomEvent', { event, data });
    }
  });
}
```

Combining modules

```js
const store = createStoreon([
  coutnerModule,
  memoryModule,
  trackEventModule,
]);
```

## Conclusion

As you can see, we were able to quickly implement our state management solution with a minimal amount of code. Of course, due to data binding in Velo, you normally don’t have to worry about state management. However, in more complex applications, the issue can become more difficult, and state management will become more challenging to handle.

State management can be a tricky problem, but Storeon offers a simple, yet robust solution. In addition, Velo allows us to quickly implement this in our application, all while focusing on code and not having to spend time dealing with other issues.

## Resources

- [Storeon](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes)
- [Storeon on GitHub](https://github.com/storeon/storeon)
- [Storeon Velo on GitHub](https://github.com/shoonia/storeon-velo)
- [Discussion on Velo Forum](https://www.wix.com/velo/forum/coding-with-velo/a-tiny-event-based-state-manager-storeon-for-velo)
- [This article on medium.com](https://shoonia.medium.com/a-tiny-event-based-state-manager-storeon-for-corvid-32bf750529e5)
- [This article on dzone.com](https://dzone.com/articles/a-tiny-event-based-state-manager-storeon-for-corvi)

## Demo

- [Site](https://www.wix.com/alexanderz5/storeon-velo)
- [Open In Editor](https://editor.wix.com/html/editor/web/renderer/new?siteId=d6003ab4-7b91-4fe1-b65e-55ff3baca1f4&metaSiteId=654936ba-93bc-4f97-920a-c3050dd82fe7&autoDevMode=true)

## Also

- [“State management in Velo” by Shahar Talmi](https://shahata.medium.com/state-management-in-corvid-2ebfa8740abd)
