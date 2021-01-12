---
publish: true
path: '/management-of-app-state-on-wix-site'
template: 'default'
date: '2020-01-10'
modified: '2021-01-10'
lang: 'en'
title: 'A Guide to management of a difficult app state on Wix Site with Storeon'
description: "Storeon it's a simple state manager that has a so friendly interface. In this guide, we look up how we can separate business logic from view part using Storeon"
author: 'Alexander Zaytsev'
image: '#'
---

# A Guide to management of a difficult app state on Wix Site with Storeon

*Storeon it's a simple state manager that has a so friendly interface. In this guide, we look up how we can separate business logic from view part using Storeon then we learn how to work with async operations and how we can create Storeon modules (middlewares) for splitting logic operation in your app.*

## Motivation

## Requirements

To understand this tutorial, you should know of modern JavaScript ES2017 paradigms and have the experience to work with Wix Editor and with the basic Velo APIs, like [wix-data](https://www.wix.com/velo/reference/wix-data) and [wix-window](https://www.wix.com/velo/reference/wix-window), etc.

## DO

<figure>
 <figcaption>
    Installing <mark>storeon-velo</mark>. Hover the Packages (npm) section header in the Velo sidebar, click the <code>+</code>  plus icon, and select Install a New Package.
  </figcaption>
  <img
    src="https://static.wixstatic.com/media/fd206f_0ac80f242f60439f853d6eafeb47106c~mv2.jpg"
    width="770"
    height="263"
    alt="Wix Editor left side panel to install a new package"
    loading="lazy"
    decoding="async"
    crossorigin="anonymous"
  />
</figure>

<figure>
  <figcaption>
    Use the search box to find the package.
  </figcaption>
  <img
    src="https://static.wixstatic.com/media/e3b156_5ae2f75f6f564611adb4dc8a2a53a661~mv2.jpg"
    width="751"
    height="304"
    alt="Package Manager panel in Wix editor, installing storeon-velo"
    loading="lazy"
    decoding="async"
    crossorigin="anonymous"
  />
</figure>

Now we can use the package in our code.

### Create store

**Files Structure**

```tree
public/
└── store/
    └── index.js
```

**public/store/index.js**

```js
import { createStoreon } from 'storeon-velo';

// Creates an empty store and exports 4 methods
export const {
  getState,
  dispatch,
  connect,
  connectPage
} = createStoreon([]);
```

So we create an empty store it hasn't any data. By now, it's an empty object. For management data in the Storeon used module functions. The module's function accepts a store object that provides [three methods](https://github.com/storeon/storeon#store) to work with the state.

**Example of a store module:**

```js
// The store has 3 methods:
export const storeModule = ({ get, on, dispatch }) => {
  // will return current state. The state is always an object.
  const state = get();

  // will add an event listener.
  on('event/type', (state, data) => { });

  // will emit an event with optional data.
  dispatch('event/type', { xyz: 124 });
};
```

```diff
public/
└── store/
+   ├── itemsModule.js
    └── index.js
```

**public/store/itemsModule.js**

```js
export const itemsModule = ({ on }) => {
  // The best moment to set an initial state.
  on('@init', () => {
    return {
      items: [],
    };
  });
};
```

**public/store/index.js**

```js
import { createStoreon } from 'storeon-velo';

import { itemsModule } from './itemsModule';

export const {
  getState,
  dispatch,
  connect,
  connectPage
} = createStoreon([itemsModule]);
```

**Home Page Code**

```js
import { getState, dispatch, connect, connectPage } from 'public/store';

/**
 * Subscribe for state property "items".
 * The callback function will be run when the page loads $w.onReady()
 * and each time when property "items" would change.
 */
connect('items', (state) => {
  console.log('Connect:', state);
});
```

### Add new item

**Home Page Code**

```js
import { v4 as uuid } from 'uuid';
```

**Home Page Code**

```js
import { v4 as uuid } from 'uuid';
import { getState, dispatch, connect, connectPage } from 'public/store';

connect('items', (state) => {
  console.log('Connect:', state);
});

// Wrapper around $w.onReady()
// The callback function will be run once.
connectPage(() => {
  const $input = $w('#input1');

  $input.onKeyPress((event) => {
    if (event.key !== 'Enter') {
      return;
    }

    // Dispatch events with new item
    dispatch('items/add', {
      _id: uuid(),
      title: $input.value,
    });

    // reset input value
    $input.value = '';
  });
});
```

**public/store/itemsModule.js**

```js
export const itemsModule = ({ on }) => {
  on('@init', () => {
    return {
      items: [],
    };
  });

  on('items/add', ({ items }, newItem) => {
    return {
      items: [newItem, ...items],
    };
  });
};
```

### Add logger tool

```diff
public/
└── store/
    ├── itemsModule.js
+   ├── logger.js
    └── index.js
```

**public/store/logger.js**

```js
export const logger = ({ on }) => {
  on('@dispatch', (state, [event, data]) => {
    if (event === '@changed') {
      const keys = Object.keys(data).join(', ');
      console.log(`changed: ${keys}`, state);
    } else if (typeof data !== 'undefined') {
      console.log(`action: ${event}`, data);
    } else {
      console.log(`action: ${event}`);
    }
  });
};
```

[`wixWindow.viewMode`](https://www.wix.com/velo/reference/wix-window/viewmode)

**public/store/index.js**

```js
import { viewMode } from 'wix-window';
import { createStoreon } from 'storeon-velo';

import { itemsModule } from './itemsModule';
import { logger } from './logger';

export const {
  getState,
  dispatch,
  connect,
  connectPage,
} = createStoreon([
  itemsModule,
  viewMode === 'Preview' && logger,
]);
```

### Render notes

**Home Page Code**

```js
connect('items', ({ items }) => {
  const $repeater = $w('#repeater1');

  $repeater.data = items;
  $repeater.forEachItem(($item, data) => {
    $item('#text1').text = data.title;
  });
});
```

### Remove notes

[`event.context`](https://www.wix.com/velo/reference/$w/event/context) `itemId`

**Home Page Code**

```js
connectPage(() => {
  const $input = $w('#input1');

  $input.onKeyPress((event) => {
    if (event.key !== 'Enter') {
      return;
    }

    dispatch('items/add', {
      _id: uuid(),
      title: $input.value,
    });

    $input.value = '';
  });

  $w('#button1').onClick((event) => {
    dispatch('items/remove', event.context.itemId);
  });
});
```

**console**

```bash
action: items/remove > 33edda56-72cc-4cf2-8da4-39939f5fd8e6
```

**public/store/itemsModule.js**

```js
on('items/remove', ({ items }, itemId) => {
  return {
    items: items.filter((i) => i._id !== itemId),
  };
});
```

## Synchronization with database

<img
  src="https://static.wixstatic.com/media/fd206f_4b7551f3bc754e3cb04e11e03fe5c3da~mv2.jpg"
  width="343"
  height="201"
  alt="Wix Editor side panel with an example for adding a new collection"
  oading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>
### Create database module

```diff
public/
└── store/
    ├── itemsModule.js
+   ├── databaseModule.js
    ├── logger.js
    └── index.js
```

**public/store/databaseModule.js**

```js
import wixData from 'wix-data';

export const databaseModule = async ({ dispatch }) => {
  const collectionId = 'notes';

  try {
    const { items } = await wixData.query(collectionId).find();

    dispatch('items/loaded', items);
  } catch (error) {/* TODO: add error handler */}
};
```

**Example of error handling:**

```js
try {
  const { items } = await wixData.query(collectionId).find();

  dispatch('items/loaded', items);
} catch (error) {
  dispatch('errors/database', error);
}
```

**public/store/index.js**

```js
import { viewMode } from 'wix-window';
import { createStoreon } from 'storeon-velo';

import { itemsModule } from './itemsModule';
import { databaseModule } from './databaseModule';
import { logger } from './logger';

export const {
  getState,
  dispatch,
  connect,
  connectPage,
} = createStoreon([
  itemsModule,
  databaseModule,
  viewMode === 'Preview' && logger,
]);
```

**console**

```bash
action: items/loaded > [...]
```

**public/store/itemsModule.js**

```js
on('items/loaded', (_, loadedItems) => {
  return {
    items: [...loadedItems],
  };
});
```

### Add/Remove items from database

**public/store/databaseModule.js**

```js
import wixData from 'wix-data';

export const databaseModule = async ({ on, dispatch }) => {
  const collectionId = 'notes';

  try {
    const { items } = await wixData.query(collectionId).find();

    dispatch('items/loaded', items);
  } catch (error) { /**/ }

  // Add a new item to the database collection
  on('database/add', async (_, newItem) => {
    try {
      await wixData.save(collectionId, newItem);

      dispatch('items/add', newItem);
    } catch (error) { /**/ }
  });

  // Remove an item from database collection by ID
  on('database/remove', async (_, itemId) => {
    try {
      await wixData.remove(collectionId, itemId);

      dispatch('items/remove', itemId);
    } catch (error) { /**/ }
  });
};
```

**Home Page Code**

```js
$input.onKeyPress((event) => {
  if (event.key !== 'Enter') {
    return;
  }

  // Redirect dispatching to "database/add" from "items/add"
  dispatch('database/add', {
    _id: uuid(),
    title: $input.value,
  });

  $input.value = '';
});

$w('#button1').onClick((event) => {
  // Redirect dispatching "database/remove" from "items/remove"
  dispatch('database/remove', event.context.itemId);
});
```

## Async lock module

```diff
public/
└── store/
    ├── itemsModule.js
    ├── databaseModule.js
+   ├── operationModule.js
    ├── logger.js
    └── index.js
```

[`regexObj.test(str)`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)

**public/store/operationModule.js**

```js
export const operationModule = ({ on }) => {
  on('@init', () => {
    return { isBusy: true };
  });

  on('@dispatch', (_, [event]) => {
    // If the events name starts with "database"
    // that means it's going async operation
    if (/^database/.test(event)) {
      return { isBusy: true };
    }

    // If the events name starts with "items"
    // then the async operation is the end
    if (/^items/.test(event)) {
      return { isBusy: false };
    }
  });
};
```

**public/store/index.js**

```js
import { viewMode } from 'wix-window';
import { createStoreon } from 'storeon-velo';

import { itemsModule } from './itemsModule';
import { databaseModule } from './databaseModule';
import { operationModule } from './operationModule';
import { logger } from './logger';

export const {
  getState,
  dispatch,
  connect,
  connectPage,
} = createStoreon([
  itemsModule,
  databaseModule,
  operationModule,
  viewMode === 'Preview' && logger,
]);
```

**Home Page Code**

```js
connect('isBusy', ({ isBusy }) => {
  const $els = $w('#input1, #button1');

  if (isBusy) {
    $els.disable();
  } else {
    $els.enable();
  }
});
```

## Code Snippets

```diff
public/
└── store/
    ├── itemsModule.js
    ├── databaseModule.js
    ├── operationModule.js
    ├── logger.js
    └── index.js
```

<details>
  <summary>
    <strong>public/store/itemsModule.js</strong>
  </summary>

```js
export const itemsModule = ({ on }) => {
  on('@init', () => {
    return {
      items: [],
    };
  });

  on('items/loaded', (_, loadedItems) => {
    return {
      items: [...loadedItems],
    };
  });

  on('items/add', ({ items }, newItem) => {
    return {
      items: [newItem, ...items],
    };
  });

  on('items/remove', ({ items }, itemId) => {
    return {
      items: items.filter((i) => i._id !== itemId),
    };
  });
};
```

</details>

<details>
  <summary>
    <strong>public/store/databaseModule.js</strong>
  </summary>

```js
import wixData from 'wix-data';

export const databaseModule = async ({ on, dispatch }) => {
  const collectionId = 'notes';

  try {
    const { items } = await wixData.query(collectionId).find();

    dispatch('items/loaded', items);
  } catch (error) { /**/ }

  on('database/add', async (_, newItem) => {
    try {
      await wixData.save(collectionId, newItem);

      dispatch('items/add', newItem);
    } catch (error) { /**/ }
  });

  on('database/remove', async (_, itemId) => {
    try {
      await wixData.remove(collectionId, itemId);

      dispatch('items/remove', itemId);
    } catch (error) { /**/ }
  });
};
```

</details>

<details>
  <summary>
    <strong>public/store/operationModule.js</strong>
  </summary>

```js
export const operationModule = ({ on }) => {
  on('@init', () => {
    return { isBusy: true };
  });

  on('@dispatch', (_, [event]) => {
    if (/^database/.test(event)) {
      return { isBusy: true };
    }

    if (/^items/.test(event)) {
      return { isBusy: false };
    }
  });
};
```

</details>

<details>
  <summary>
    <strong>public/store/logger.js</strong>
  </summary>

```js
export const logger = ({ on }) => {
  on('@dispatch', (state, [event, data]) => {
    if (event === '@changed') {
      const keys = Object.keys(data).join(', ');
      console.log(`changed: ${keys}`, state);
    } else if (typeof data !== 'undefined') {
      console.log(`action: ${event}`, data);
    } else {
      console.log(`action: ${event}`);
    }
  });
};
```

</details>

<details>
  <summary>
    <strong>public/store/index.js</strong>
  </summary>

```js
import { viewMode } from 'wix-window';
import { createStoreon } from 'storeon-velo';

import { itemsModule } from './itemsModule';
import { databaseModule } from './databaseModule';
import { operationModule } from './operationModule';
import { logger } from './logger';

export const {
  getState,
  dispatch,
  connect,
  connectPage,
} = createStoreon([
  itemsModule,
  databaseModule,
  operationModule,
  viewMode === 'Preview' && logger,
]);
```

</details>

<details>
  <summary>
    <strong>Home Page (code)</strong>
  </summary>

```js
import { v4 as uuid } from 'uuid';
import { getState, dispatch, connect, connectPage } from 'public/store';

connect('items', ({ items }) => {
  const $repeater = $w('#repeater1');

  $repeater.data = items;
  $repeater.forEachItem(($item, data) => {
    $item('#text1').text = data.title;
  });
});

connect('isBusy', ({ isBusy }) => {
  const $els = $w('#input1, #button1');

  if (isBusy) {
    $els.disable();
  } else {
    $els.enable();
  }
});

connectPage(() => {
  const $input = $w('#input1');

  $input.onKeyPress((event) => {
    if (event.key !== 'Enter') {
      return;
    }

    dispatch('database/add', {
      _id: uuid(),
      title: $input.value,
    });

    $input.value = '';
  });

  $w('#button1').onClick((event) => {
    dispatch('database/remove', event.context.itemId);
  });
});
```

</details>

## Conclusion

## Resources

- [Storeon: “Redux” in 173 bytes](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes)
- GitHub source code
  - [storeon](https://github.com/storeon/storeon)
  - [storeon-velo](https://github.com/shoonia/storeon-velo)

## Posts

- [A tiny event-based state manager Storeon for Velo](/corvid-storeon/)
