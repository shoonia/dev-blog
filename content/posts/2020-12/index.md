---
publish: true
path: '/cache'
template: 'default'
date: '2020-12-25'
modified: ''
lang: 'en'
title: 'Corvid by Wix: Reducing server-side calls using a caching mechanism'
description: ''
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_8466d2a5924640ecb8e6cf41e1151d1b~mv2.png/v2/fill/w_300,h_300/i.jpg'
---

# Corvid by Wix: Reducing server-side calls using a caching mechanism

<img
  src="https://static.wixstatic.com/media/e3b156_8466d2a5924640ecb8e6cf41e1151d1b~mv2.png"
  width="800"
  height="330"
  alt="mountain chain"
  crossorigin="anonymous"
/>

## Motivation

One of my lovely feature in the Corvid sites it's the [Web Modules](https://support.wix.com/en/article/corvid-web-modules-calling-server-side-code-from-the-front-end). It's the powerful API that provides calling server-side code from the client. Under the hood, this API using [Ajax](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) requests to the backend. Each call of **Web Modules** function will do a new request to the backend.

How does it work?

We just add a new file with a special extension `.jsw` to the backend section. This extension needed to mark this file as a Web Module.

```tree
backand
└── aModule.jsw
```

<figure>
  <figcaption>
    <strong>Add new Web Module</strong>
  </figcaption>
  <img
    src="https://static.wixstatic.com/media/e3b156_19655839bf914cde8b778f65fe91383a~mv2.jpg"
    width="800"
    height="280"
    alt="Add new Web Module"
    loading="lazy"
    decoding="async"
    crossorigin="anonymous"
  />
</figure>

Inside the `.jsw` file, we have to export a function statement. Be attention, it must be a [function statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) (Traditional Function) or async function statement (Web Modules doesn't support [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) or any other type of export).

**backend/aModule.jsw**

```js
// Filename: backend/aModule.jsw (web modules need to have a .jsw extension)

export function multiply(factor1, factor2) {
  return factor1 * factor2;
}
```

That's all! The Corvid automatically creates the API entry point to your backend function.

On the client code, you export the `.jsw` as a regular module. When we call a `.jsw` function the Corvid doing a POST request to the backend, therefore `.jsw` functions always return a promise.

**Home Page**

```js
import { multiply } from 'backend/aModule';

multiply(4, 5).then((product) => {
  console.log(product);
});
```

So, return to caching.

In this article, we create a caching mechanism for backend functions that return a persistent result. When we call the backend function the first time then we save the response to the cache, and in the next call, we reuse a previous result without API calls.

## Implementation

```tree
public
└── memo.js
```

**public/memo.js**

```js
export const memo = (func) => {
  return (...args) => {
    return func(...args);
  };
}
```

```js
export const memo = (func) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    return func(...args).then((response) => {
      cache.set(key, response);

      return response;
    });
  };
}
```

```js
export const memo = (func) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return Promise.resolve(cache.get(key));
    }

    return func(...args).then((response) => {
      cache.set(key, response);

      return response;
    });
  };
}
```

**Home Page**

```js
import { multiply } from 'backend/aModule';
import { memo } from 'public/memo';

const memoizedMultiply = memo(multiply);

memoizedMultiply(4, 5).then((product) => {
  console.log(product);
});
```

## Expirable cache

Let's consider another case when we don't want to cache a response to infinity time.

Suppose, we have some API that changes a response result not very often, but the result could change (for example a currency exchange). And we want to set a max-age of the cache, and if the cache is expired then redo of API call.

```js
const FIVE_MINUTES = 1000 * 60 * 5;

const memoizedMultiply = memo(multiply, FIVE_MINUTES);
```

```js
export const memo = (func, maxAge = Infinity) => {
  // ...
}
```

```js
cache.set(key, [Date.now(), response]);
```

```js
if (cache.has(key)) {
  const [createdDate, response] = cache.get(key);
  const time = Date.now() - createdDate;

  if (time < maxAge) {
    return Promise.resolve(response);
  }

  cache.delete(key);
}
```

```js
export const memo = (func) => {
  const cache = new Map();

  const memoFunc = (...args) => {
    // ...
  };

  memoFunc.clear = () => {
    cache.clear();
  };

  return memoFunc;
}
```

```js
import { multiply } from 'backend/aModule';
import { memo } from 'public/memo';

const memoizedMultiply = memo(multiply, 1000 * 60 * 5);

memoizedMultiply(2, 3)
  .then((product) => { })
  .catch((error) => { });

// Manually clear all cache
memoizedMultiply.clear();
```

## Examples

**Caching the wix-data response**

```js
import wixData from 'wix-data';
import { memo } from 'public/memo';

// Caching the wix-data response by some field
const getGoods = memo((category) => {
  return wixData.query('goods')
    .eq('category', category)
    .find()
    .then((response) => response.items);
});

getGoods('gifts')
  .then((items) => { })
  .catch((error) => { });
```

**Caching an API call**

```js
import { getJSON } from 'wix-fetch';
import { memo } from 'public/memo';

// Caching an API call by some path part
const getPostById = memo((id) => {
  return getJSON(`https://jsonplaceholder.typicode.com/posts/${id}`);
});

getPostById('1')
  .then((post) => { })
  .catch((error) => { });
```

## Code Snippets

<details>
  <summary>
    <strong>memo.js - Core</strong>
  </summary>

```js
/**
 * @param {(...arg: any[]) => Promise<any>} func
 * @returns {(...arg: any[]) => Promise<any>}
 */
export const memo = (func) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return Promise.resolve(cache.get(key));
    }

    return func(...args).then((response) => {
      cache.set(key, response);

      return response;
    });
  };
}
```

</details>

<details>
  <summary>
    <strong>memo.js - With Max Age</strong>
  </summary>

```js
/**
 * @param {(...arg: any[]) => Promise<any>} func
 * @param {number} maxAge - milliseconds of response store in cache
 */
export const memo = (func, maxAge = Infinity) => {
  const cache = new Map();

  /** MemoFunc */
  const memoFunc = (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const [createdDate, response] = cache.get(key);
      const time = Date.now() - createdDate;

      if (time < maxAge) {
        return Promise.resolve(response);
      }

      cache.delete(key);
    }

    return func(...args).then((response) => {
      cache.set(key, [Date.now(), response]);

      return response;
    });
  };

  /**
   * Clears all cache
   * @memberof MemoFunc
   */
  memoFunc.clear = () => {
    cache.clear();
  };

  return memoFunc;
}
```

</details>

## Resources

- [MDN: Standard built-in objects - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: `Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Corvid Web Modules: Calling Server-Side Code from the Front-End](https://support.wix.com/en/article/corvid-web-modules-calling-server-side-code-from-the-front-end)

## Posts

- [Message channel to iFrame](/message-channel-to-iframe/)
- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
