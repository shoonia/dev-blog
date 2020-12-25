---
publish: true
path: '/cache'
template: 'default'
date: '2020-12-25'
modified: ''
lang: 'en'
title: 'New'
description: 'New'
author: 'Alexander Zaytsev'
image: ''
---

# New

## Example of Web Module

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
  .then(() => { })
  .catch(() => { });

memoizedMultiply.clear();
```

## Examples

```js
import wixData from 'wix-data';
import { getJSON } from 'wix-fetch';
import { multiply } from 'backend/aModule';
import { memo } from 'public/memo';

const memoizedMultiply = memo(multiply);

// Using with wix-data
const getGoods = memo((category) => {
  return wixData.query('category').eq('category', category).find();
});

// fetching a JSON data
const getPostById = memo((id) => {
  return getJSON(`https://jsonplaceholder.typicode.com/posts/${id}`);
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
- [MDN: `Promise.resolve()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Corvid Web Modules: Calling Server-Side Code from the Front-End](https://support.wix.com/en/article/corvid-web-modules-calling-server-side-code-from-the-front-end)

## Posts

- [Message channel to iFrame](/message-channel-to-iframe/)
- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
