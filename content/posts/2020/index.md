---
publish: false
path: '/s'
template: 'default'
date: '2020'
lang: 'en'
title: 's'
description: 's'
author: 'Alexander Zaytsev'
image: '#'
---

# A Guide to management a difficult app state on Wix Site with Storeon

*Storeon it's a simple state manager that has a very friendly interface. In this guide, we look up how we can separate business logic and view using Storeon, we learn how to work with async operations and how we can create Storeon modules (middlewares) for splitting logic operation in your app.*

---

A year ago was released a connector [corvid-storeon](https://github.com/shoonia/corvid-storeon) that provides using a [Storeon](https://github.com/storeon/storeon) with Corvid sites. I wrote an article ["A tiny event-based state manager Storeon for Corvid"](/corvid-storeon) were showing basic capabilities to use state management.

## Motivation

**Site Structure**

```bash
public/
│
└── store/
    │
    ├── itemsModule.js
    │
    └── index.js
```

**`public/store/index.js`**

```js
import { createStoreon } from 'corvid-storeon';

import { itemsModule } from './itemsModule';

export const {
  getState,
  dispatch,
  connect,
  connectPage
} = createStoreon([itemsModule]);
```

**`public/store/itemsModule.js`**

```js
export const itemsModule = (store) => {
  store.on('@init', () => {
    return {
      items: [],
    };
  });
};
```

**Home Page Code**

```js
import { getState, dispatch, connect, connectPage } from 'public/store';

connectPage((state) => {
  console.log('Ready:', state);
});
```

**Home Page Code**

```js
import { v4 as uuid } from 'uuid';
import { getState, dispatch, connect, connectPage } from 'public/store';

connectPage(() => {
  const $input = $w('#input');

  $input.onKeyPress(({ key }) => {
    if (key !== 'Enter') {
      return;
    }

    dispatch('items/add', {
      _id: uuid(),
      title: $input.value,
    });

    $input.value = null;
  });
});
```

**`public/store/itemsModule.js`**

```js
export const itemsModule = (store) => {
  store.on('@init', () => {
    return {
      items: [],
    };
  });

  store.on('items/add', ({ items }, newItem) => {
    return {
      items: [newItem, ...items],
    };
  });
};
```

**`public/store/logger.js`**

```js
export const logger = (store) => {
  store.on('@dispatch', (state, [event, data]) => {
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

**`public/store/index.js`**

```js
import wixWindow from 'wix-window';
import { createStoreon } from 'corvid-storeon';

import { itemsModule } from './itemsModule';
import { logger } from './logger';

export const {
  getState,
  dispatch,
  connect,
  connectPage,
} = createStoreon([
  itemsModule,
  (wixWindow.viewMode === 'Preview' && logger),
]);
```

**Home Page Code**

```js
connect('items', ({ items }) => {
  const $repeater =  $w('#repeater');

  $repeater.data = items;
  $repeater.forEachItem(($item, data) => {
    $item('#text').text = data.title;
  });
});
```

**Home Page Code**

```js
connectPage(() => {
  const $input = $w('#input');
  const $buttonRemove = $w('#buttonRemove');

  $input.onKeyPress(({ key }) => {
    if (key !== 'Enter') {
      return;
    }

    dispatch('items/add', {
      _id: uuid(),
      title: $input.value,
    });

    $input.value = null;
  });

  $buttonRemove.onClick((event) => {
    dispatch('items/remove', event.context.itemId);
  });
});
```

**console**

```bash
action: items/remove > 33edda56-72cc-4cf2-8da4-39939f5fd8e6
```

**`public/store/itemsModule.js`**

```js
store.on('items/remove', ({ items }, itemId) => {
  return {
    items: items.filter((i) => i._id !== itemId),
  };
});
```

**`public/store/index.js`**

```js
import wixWindow from 'wix-window';
import { createStoreon } from 'corvid-storeon';

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
  (wixWindow.viewMode === 'Preview' && logger),
]);
```

**`public/store/databaseModule.js`**

```js
import wixData from 'wix-data';

export const databaseModule = async (store) => {
  const dbName = 'notes';

  try {
    const { items } = await wixData.query(dbName).find();

    store.dispatch('items/loaded', items);
  } catch (error) {/* TODO: add error handler */}
};
```

**console**

```bash
action: items/loaded > [...]
```

**`public/store/itemsModule.js`**

```js
store.on('items/loaded', (_, loadedItems) => {
  return {
    items: [...loadedItems],
  };
});
```

**`public/store/databaseModule.js`**

```js
export const databaseModule = async (store) => {
  const dbName = 'notes';

  try {
    const { items } = await wixData.query(dbName).find();

    store.dispatch('items/loaded', items);
  } catch (error) {/* TODO: add error handler */}

  store.on('database/add', async (_, newItem) => {
    try {
      await wixData.save(dbName, newItem);
      store.dispatch('items/add', newItem);
    } catch (error) {/* TODO: add error handler */}
  });

  store.on('database/remove', async (_, itemId) => {
    try {
      await wixData.remove(dbName, itemId);
      store.dispatch('items/remove', itemId);
    } catch (error) {/* TODO: add error handler */}
  });
};
```

**Home Page Code**

```js
$input.onKeyPress(({ key }) => {
  if (key !== 'Enter') {
    return;
  }

  dispatch('database/add', {
    _id: uuid(),
    title: $input.value,
  });

  $input.value = null;
});

$buttonRemove.onClick((event) => {
  dispatch('database/remove', event.context.itemId);
});
```

**`public/store/operationModule.js`**

```js
export const operationModule = (store) => {
  store.on('@init', () => {
    return { isBusy: true };
  });

  store.on('@dispatch', (_, [event]) => {
    if (/^database/.test(event)) {
      return { isBusy: true };
    }

    if (/^items/.test(event)) {
      return { isBusy: false };
    }
  });
};
```

**`public/store/index.js`**

```js
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
  (wixWindow.viewMode === 'Preview' && logger),
]);
```

**Home Page Code**

```js
connect('isBusy', ({ isBusy }) => {
  const $el = $w('#input, #buttonRemove');

  if (isBusy) {
    $el.disable();
  } else {
    $el.enable();
  }
});
```

## Conclusion

## Resources

- [Storeon: “Redux” in 173 bytes](https://evilmartians.com/chronicles/storeon-redux-in-173-bytes)
- GitHub source code
  - [storeon](https://github.com/storeon/storeon)
  - [corvid-storeon](https://github.com/shoonia/corvid-storeon)

## Posts

- [A tiny event-based state manager Storeon for Corvid.](/corvid-storeon)
- [Event handling of Repeater Item](/event-handling-of-repeater-item)
- [Using HTML template to the better performance](/html-template-in-corvid)
