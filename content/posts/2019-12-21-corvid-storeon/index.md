---
publish: true
path: '/corvid-storeon'
template: 'default'
date: '2019-12-21T12:00:00.000Z'
lang: 'en'
title: 'A tiny event-based state manager Storeon for Corvid.'
description: 'The state of the Corvid sites it’s a really big problem. In this article, I share my solution.'
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_f345e612268141b89367f3ef3da42337~mv2.png/v2/fill/w_300,h_300/cs.png'
---

# A tiny event-based state manager Storeon for Corvid.

![Corvid Storeon](https://static.wixstatic.com/media/e3b156_f345e612268141b89367f3ef3da42337~mv2.png)

## Motivation

In the article [“State management in Corvid”](https://medium.com/@shahata/state-management-in-corvid-2ebfa8740abd) Shahar Talmi bringing up a question about control app states in Corvid.

The state of app it’s a really big problem. If you have a lot of components dependencies between each other or a lot of user interaction, eventually, add a new feature or support app is going through suffering.

In this article, I share my solution. It’s a very tiny library [Storeon](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes) (core 175 bytes in gzip) with an easy interface. So I wrote a wrapper for integration with Corvid. As a result, we have the state manager [corvid-storeon](https://github.com/shoonia/corvid-storeon) less than 80 lines of code.

## How it works

We will create a traditional study app with counters. I will use two counters for the better demonstration.

At first, we just copy and paste the [`dist/index.esm.js`](https://github.com/shoonia/corvid-storeon/blob/master/dist/index.esm.js) code from GitHub repository to public file and create one more file for store initialization.

```bash
public
├── corvid-storeon.js
└── store.js
```

In `public/store.js` we write our business logic.

Storeon state is always an object, it can’t be anything else. It’s a small limitation not too important to us but we have to remember about it.

**public/store.js**

```js
// The store should be created with createStore() function.
// It accepts a list of the modules.
import { createStore } from 'public/corvid-storeon.js';

// Each module is just a function,
// which will accept a store and bind their event listeners.
function counterModule(store) {
  // @init will be fired in createStore.
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

// createStore() returns 4 methods to work with store
export const {
  getState, // <- will return current state.
  dispatch, // <- will emit an event with optional data.
  connect, // <- connect to state by property key. 
  connectPage, // <- wrapper around $w.onReady()
} = createStore([counterModule]);
```

So we created a store in the public folder and export from there 4 methods. In the second part, we will create UI and we will write logic to change state.

Let’s add 2 text elements for displaying counter value, and 4 buttons for events increment/decrement.

![UI example](https://static.wixstatic.com/media/e3b156_62643a01cf9843439a560fab7dde566a~mv2.png)

Of course, we have to import the store methods from the public file to the page code.

```js
import { dispatch, connect, connectPage } from 'public/store';
```

With `connect("key", callback)` we can subscribe for any store properties and the callback function will be run when the page loaded and each time when the listed property would change.

The `connectPage(callback)` it’s a wrapper around `$w.onReady(callback)`.

With `dispatch(event, [data])` we will emit events.

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

DEMO: [Open In Editor](https://editor.wix.com/html/editor/web/renderer/new?siteId=d6003ab4-7b91-4fe1-b65e-55ff3baca1f4&metaSiteId=654936ba-93bc-4f97-920a-c3050dd82fe7)

## Modules
The function `createStore(modules)` accepts a list of modules. We can create different functions for splitting business logic into our app. Let’s see a few examples:

Synchronization the App state with `wix-storage` memory API:

```js
// https://www.wix.com/corvid/reference/wix-storage.html#memory
import { memory } from 'wix-storage';

export function memoryModule(store) {
  // @changed will be fired every when event listeners changed the state.
  // It receives object with state changes.
  store.on('@changed', (state) => {
    memory.setItem('key', state);
  });
}
```

Tracking event to external analytics tools with `wixWindow.trackEvent();`

```js
import wixWindow from 'wix-window';

export function trackEventModule(store) {
  // @dispatch will be fired on every dispatch(event, [data]) call.
  // It receives an array with the event name and the event’s data.
  // Can be useful for debugging.
  store.on('@dispatch', (state, [event, data]) => {
    if (event !== '@changed' && event !== '@dispatch') {
      // Sends a tracking event to external analytics tools.
      wixWindow.trackEvent(event, data);
    }
  });
}
```

Combining modules

```js
const store = createStore([
  coutnerModule,
  memoryModule,
  trackEventModule,
]);
```

## Request Corvid-Storeon in Package Manager

At this moment (21.12.2019) corvid-store is not available in Corvid package manager. If you like it, please send the request to [Package Manager](https://support.wix.com/en/article/corvid-managing-external-code-libraries-with-the-package-manager#requesting-a-package912)

![Request Node Package](https://static.wixstatic.com/media/e3b156_00346a1e9cfe4bfdbc7c88f132d9e9bf~mv2.png)

## Resources

- [Storeon](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes)
- [Storeon on GitHub](https://github.com/storeon/storeon)
- [Corvid Storeon on GitHub](https://shoonia.wixsite.com/blog/corvid-storeon)
- [Discussion on Corvid Forum](https://www.wix.com/corvid/forum/community-discussion/a-tiny-event-based-state-manager-storeon-for-corvid)
- DEMO: [Open In Editor](https://editor.wix.com/html/editor/web/renderer/new?siteId=d6003ab4-7b91-4fe1-b65e-55ff3baca1f4&metaSiteId=654936ba-93bc-4f97-920a-c3050dd82fe7)
- [This article on medium.com](https://medium.com/@shoonia/a-tiny-event-based-state-manager-storeon-for-corvid-32bf750529e5)

## Also
- [“State management in Corvid” by Shahar Talmi](https://medium.com/@shahata/state-management-in-corvid-2ebfa8740abd)

