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

One of my lovely feature in the Corvid sites it's the [Web Modules](https://support.wix.com/en/article/corvid-web-modules-calling-server-side-code-from-the-front-end). It's the powerful API that provides calling server-side code from the client. Under the hood, this API using [Ajax](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) requests to the backend. For us, it looks like just a regular export of function, but the reality, each call of the **Web Modules** function will execute the new HTTP request to the backend.

In this article, we create a caching mechanism for backend functions. If your `jsw` function always returns the same response then we don't need to execute HTTP requests for each call. We can cache the first response and reuse it for the next calls.

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

## Example

Start with a basic example.

This demonstration function depends on two arguments.

**backend/aModule.jsw**

```js
// Filename: backend/aModule.jsw (web modules need to have a .jsw extension)

export function multiply(factor1, factor2) {
  return factor1 * factor2;
}
```

**Home Page**

```js
import { multiply } from 'backend/aModule';

multiply(4, 5).then((product) => {
  console.log(product);
});
```

## Implementation

```tree
public
└── memo.js
```

### Decorator

**public/memo.js**

```js
export const memo = (func) => {
  return (...args) => {
    return func(...args);
  };
}
```

### Cache

For storing a cache we will use a standard build-in JavaScript object [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). This object has convenient methods for work with key-value pairs.

**The Map object**

```js
// Creates a new Map object.
const map = new Map();

// Stores the value by the key.
map.set('key', 'value');

// Returns true if the key exists, false otherwise.
map.has('key');

// Returns the value by the key, undefined if key doesn't exist in map.
map.get('key');

// Removes the value by the key.
map.delete('key');

// Removes everything from the map
map.clear();

// Also:
// map.size;
// map.keys();
// map.values();
// map.entries();
// map.forEach((value, key, map) => {  });
```

```js
export const memo = (func) => {
  const cache = new Map();

  return (...args) => {
    // Create a key from arguments
    const key = JSON.stringify(args);

    // Execute the original function
    return func(...args).then((response) => {
      // Waits when the promise resolves
      // and saves the response to the cache
      cache.set(key, response);

      // Returns the response to next `.then()` chain
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

    // Checking cache
    if (cache.has(key)) {
      // Wrap the cached result to promise
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

Suppose, we have some API that changes a response result not very often, but the result could change (for example a currency exchange). And we want to set a max-age of the cache, and if the cache is expired then redo of the API call.

```js
const FIVE_MINUTES = 1000 * 60 * 5;

// Store cache to 5 minute
const memoizedMultiply = memo(multiply, FIVE_MINUTES);
```

```js
// Set a default value for max-age as Infinity time
export const memo = (func, maxAge = Infinity) => {
  // ...
}
```

```js
// Save in the cache a time of created
cache.set(key, [Date.now(), response]);
```

```js
if (cache.has(key)) {
  const [createdDate, response] = cache.get(key);
  // Calculate a time between calls
  const time = Date.now() - createdDate;

  // Check time interval is less max age
  if (time < maxAge) {
    return Promise.resolve(response);
  }

  // Free a cache if max-age has expired
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

## Other examples

We created the decorator function that wraps a promise function. We can use it with all functions that return a promise.

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

// Use: get collection items by category
getGoods('gifts')
  .then((items) => { })
  .catch((error) => { });
```

The last example.

**Caching an API call: [Live Demo](https://shoonia.wixsite.com/blog/cache)**

```js
import { getJSON } from 'wix-fetch';
import { memo } from 'public/memo';

// Caching an API call by some path part
const getPostById = memo((id) => {
  return getJSON(`https://jsonplaceholder.typicode.com/posts/${id}`);
});

const loadPost = () => {
  const id = $w('#pagination1').currentPage;

  getPostById(id).then((post) => {
    $w('#text1').text = post.body;
  });
}

$w.onReady(() => {
  $w('#pagination1').onClick(loadPost);
  loadPost();
});
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
- [Map and Set](https://javascript.info/map-set)
- [MDN: `Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Corvid Web Modules: Calling Server-Side Code from the Front-End](https://support.wix.com/en/article/corvid-web-modules-calling-server-side-code-from-the-front-end)
- [Demo](https://shoonia.wixsite.com/blog/cache)

## Posts

- [Message channel to iFrame](/message-channel-to-iframe/)
- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
