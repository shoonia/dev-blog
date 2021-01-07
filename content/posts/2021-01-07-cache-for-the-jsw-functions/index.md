---
publish: true
path: '/cache-for-the-jsw-functions'
template: 'default'
date: '2021-01-07T12:00:00.000Z'
modified: '2021-01-07T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Reduce server-side calls using a caching mechanism'
description: "In this article, we create a cache mechanism for backend (jsw) functions"
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/e3b156_8466d2a5924640ecb8e6cf41e1151d1b~mv2.png/v2/fill/w_300,h_300/i.jpg'
---

# Velo by Wix: Reduce server-side calls using a caching mechanism

*In this article, we create a cache mechanism for backend (jsw) functions*

<img
  src="https://static.wixstatic.com/media/e3b156_8466d2a5924640ecb8e6cf41e1151d1b~mv2.png"
  width="800"
  height="330"
  alt="mountain chain"
  crossorigin="anonymous"
/>

## Motivation

One of my lovely feature in the Velo sites it's the [Web Modules](https://support.wix.com/en/article/velo-web-modules-calling-server-side-code-from-the-front-end). It's the powerful API that provides calling server-side code from the client. Under the hood, this API using [Ajax](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) requests to the backend. For us, it looks like just a regular export of function, but the reality, each call of the **Web Modules** function will execute the new HTTP request to the backend.

In this article, we create a caching mechanism for backend functions. If your `jsw` function always returns the same response then we don't need to execute extra HTTP requests for each call. We can cache the first response and reuse it for the next calls.

## Example

Start with a basic example.

<figure>
  <figcaption>
    <strong>Add new Web Module</strong>
  </figcaption>
  <img
    src="https://static.wixstatic.com/media/e3b156_19655839bf914cde8b778f65fe91383a~mv2.jpg"
    width="800"
    height="280"
    alt="Sidebar panel of Wix Editor for adding a new Web Module"
    loading="lazy"
    decoding="async"
    crossorigin="anonymous"
  />
</figure>

This demonstration function depends on two arguments. This function is running on the backend.

**backend/aModule.jsw**

```js
// Filename: backend/aModule.jsw (web modules need to have a .jsw extension)

export function multiply(factor1, factor2) {
  return factor1 * factor2;
}
```

We import the backend function to the client code and pass two numbers.

**Home Page**

```js
import { multiply } from 'backend/aModule';

multiply(4, 5).then((product) => {
  // Response from the backend
  console.log(product);
});
```

If we run this function with the same arguments it executes a new request, we want to escape a new request because we know that the result doesn't change.

## Implementation

Our cache mechanism will depend on the passed arguments. If the backend function has called again with the same arguments then it returns the result from the cache.

For the implementation of the cache, we create a js file in the public section.

```tree
public
└── memo.js
```

### Cache

For storing a cache we will use a standard build-in JavaScript object [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). This object has convenient methods for work with key-value pairs.

**Instance methods of the Map object**

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

### Decorator

Let's start by creating a function decorator.

`memo` is a function that accepts a function and returns the new one. The new function will run the target function. In this way, we will have a map object inside the [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

**public/memo.js**

```js
export const memo = (func) => {
  const cache = new Map();

  return (...args) => {
    return func(...args);
  };
}
```

We will create a cache key from arguments. Then we wait when the request will be done and save the result to cache by key.

**public/memo.js**

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

And in the last step, we checking a cache before running the origin function. Our function must always return a Promise object. Therefore when `memo` returns the result from the cache we should wrap the result with the [`Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).

**public/memo.js**

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

Now, when we run the wrapped function with the same arguments again then the result would get from the cache.

**Home Page**

```js
import { multiply } from 'backend/aModule';
import { memo } from 'public/memo';

const memoizedMultiply = memo(multiply);

memoizedMultiply(4, 5).then((product) => {
  console.log(product);
});
```

## Expiration

Let's consider another case when we don't want to cache a response to infinity time.

Suppose, we have some API that changes a response result not very often, but the result could change (for example a currency exchange). And we want to set a max-age of the cache, and if the cache is expired then redo of the API call.

```js
const FIVE_MINUTES = 1000 * 60 * 5;

// Store cache to 5 minute
const memoizedMultiply = memo(multiply, FIVE_MINUTES);
```

First, we add the second argument `maxAge` to the decorator function. By default, it will be [`Infinity`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) value.

```js
// Set a default value for max-age as Infinity time
export const memo = (func, maxAge = Infinity) => {
  // ...
}
```

Second, we need to save the date of the creation cache record. We change the structure for caching, it will be an array where the first item contains a timestamp and the second item the response.

```js
// Save in the cache a time of created
cache.set(key, [Date.now(), response]);
```

The last we add the condition of checking time. Just calculate the difference between two calls and check that the interval must be less than `maxAge`. If the interval bigger than `maxAge` then we need to free cache and redo API call.

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

[Code Snippets](#code-snippets)

## Cache management

The map instance has a convenient interface. For example, we can go over all keys and value with [`Map.forEach(callback[, thisArg])`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach)

Let's provide access to the map object.

**public/memo.js**

```js
export const memo = (func, maxAge = Infinity) => {
  const cache = new Map();

  const memoFunc = (...args) => {
    // ...
  };

  // Set the cache map as a property to the returned function
  memoFunc.cache = cache;

  return memoFunc;
}
```

There is a very simple solution. Save a cache as a property on the returned function.

**Home Page**

```js
import { multiply } from 'backend/aModule';
import { memo } from 'public/memo';

const memoizedMultiply = memo(multiply, 1000 * 60 * 5);

memoizedMultiply(2, 3)
  .then((product) => { })
  .catch((error) => { });

// Manually clear all cache
memoizedMultiply.cache.clear();
```

Now, we able to manually manage the cache.

## Other examples

We created the decorator for the functions that return a `Promise` object. We can use it with all functions that return a `Promise`.

For example, we have data collection that contains the category of goods. We want to cache the items of collection by some category.

We can create a function that will accept the category as the argument and return the items, and this function we can put to `memo` decorator. It will cache wix-data items by category.

**Cache the wix-data response**

```js
import wixData from 'wix-data';
import { memo } from 'public/memo';

// Caches the wix-data response by category field
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

### One more example. Fetch.

Here we use a [fake API](https://jsonplaceholder.typicode.com/) that returns [Lorem ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum) posts by ID. Let's set up the cache of the response by ID.

When any pagination button is clicked then we fetch the JSON and show the body of the post.

**Cache the API calls**

```js
import { getJSON } from 'wix-fetch';
import { memo } from 'public/memo';

// Caches an API call by some path part
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
<figure>
 <figcaption>
    Example: Cache the API calls
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/cache"
    width="100%"
    height="320"
    loading="lazy"
    crossorigin="anonymous"
    title="Embed Wix Site with the example of the cache the API calls"
    scrolling="no"
    style="overflow:hidden"
  ></iframe>
</figure>

<h2 id="code-snippets">Code Snippets</h2>

Here you find two snippets of code. The minimum needed code snippet and the full snippet with max-age.

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
  /** @type {Map<string, [number, any]>} */
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

  /** @memberof MemoFunc */
  memoFunc.cache = cache;

  return memoFunc;
};
```

</details>

## Resources

- [MDN: Standard built-in objects - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Learn: Map and Set](https://javascript.info/map-set)
- [MDN: `Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Velo Web Modules: Calling Server-Side Code from the Front-End](https://support.wix.com/en/article/velo-web-modules-calling-server-side-code-from-the-front-end)
- [Live Demo](https://shoonia.wixsite.com/blog/cache)

## Posts

- [Message channel to iFrame](/message-channel-to-iframe/)
- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
