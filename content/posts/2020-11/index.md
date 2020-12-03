---
publish: true
path: '/new'
template: 'default'
date: '2020-11-24T12:00:00.000Z'
lang: 'en'
title: 'New'
description: 'New'
author: 'Alexander Zaytsev'
image: ''
---

# New

`findOneAndRemove()` and `findAllAndRemove()`

```js
const proxy = new Proxy({}, {});
```

```js
const proxy = new Proxy({}, {
  get(_, name) {
    return name;
  },
});

console.log(proxy.any);
console.log(proxy.properties);
console.log(proxy["🤘"]);

// any
// properties
// 🤘
```

```js
const proxy = new Proxy({}, {
  get(_, name) {
    console.log(name);

    return proxy;
  },
});

proxy.wow.it.is.amazing;

// wow
// it
// is
// amazing
// Proxy {}
```

```js
const proxy = new Proxy({}, {
  get(_, name) {
    return (emoji) => console.log(name, emoji);
  },
});

proxy.we_also_can_use_a_functions("🙃");

// we_also_can_use_a_functions 🙃
```

```js
const proxy = new Proxy({}, {
  get(_, name) {
    return (emoji) => {
      console.log(name, emoji);

      return proxy;
    };
  },
});

proxy.chain("😳").functions("😱").with("🤯").attributes("🤪");

// chain 😳
// functions 😱
// with 🤯
// attributes 🤪
// Proxy {}
```

- [Proxy - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [Proxy - JavaScript.info](https://javascript.info/proxy#proxy)

```js
//
import wixData from 'wix-data';

//
export const findOneAndRemove = (collectionName) => { };
```

```js
import wixData from 'wix-data';

export const findOneAndRemove = (collectionName) => {
  //
  let dataQuery = wixData.query(collectionName);

  const proxy = new Proxy({}, {
    get(_, name) { },
  });

  //
  return proxy;
};
```

```js
export const findOneAndRemove = (collectionName) => {
  let dataQuery = wixData.query(collectionName);

  const proxy = new Proxy({}, {
    get(_, name) {
      //
      return (...args) => {
        //
        dataQuery = dataQuery[name](...args);

        //
        return proxy;
      };
    },
  });

  return proxy;
};
```

```js
import wixData from 'wix-data';

/**
 * Finds to remove an item from a collection
 *
 * @param {string} collectionName
 * @returns {wix_data.WixDataQuery}
 */
export const findOneAndRemove = (collectionName) => {
  let dataQuery = wixData.query(collectionName);

  const proxy = new Proxy({}, {
    get(_, name) {
      return (...args) => {
        dataQuery = dataQuery[name](...args);

        return proxy;
      };
    },
  });

  return proxy;
};
```

```js
import wixData from 'wix-data';

/**
 * Finds to remove an item from a collection
 *
 * @param {string} collectionName
 * @returns {wix_data.WixDataQuery}
 */
export const findOneAndRemove = (collectionName) => {
  let dataQuery = wixData.query(collectionName);

  const proxy = new Proxy({}, {
    get(_, name) {
      if (name === 'find') {
        return (options) => {
          return dataQuery.find(options).then((result) => {
            const firstItem = result.items.shift();

            if (typeof firstItem === 'undefined') {
              return null;
            }

            return wixData.remove(collectionName, firstItem._id);
          });
        };
      }

      return (...args) => {
        dataQuery = dataQuery[name](...args);

        return proxy;
      };
    },
  });

  return proxy;
};
```

```js
import { findOneAndRemove } from 'public/data-helpers';

findOneAndRemove("myCollection")
  .eq("title", "Dr.")
  .find()
  .then((results) => {
    // removed item or null if item didn't find
    let item = results;
  })
  .catch((error) => {
    let message = error;
  });
```
