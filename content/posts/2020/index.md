---
publish: true
path: '/e'
template: 'default'
date: '2020-12-05'
modified: '2020-12-05'
lang: 'en'
title: 'e'
description: ''
author: 'Alexander Zaytsev'
image: ''
---

# E

<img
  src="https://static.wixstatic.com/media/fd206f_449704d2f3144c728414b5cb2a966a97~mv2.jpg"
  width="778"
  height="257"
  alt="Wix editor layers"
  loading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>

```js
const mockData = Array.from({ length: 5 }, (_, index) => {
  return { _id: String(index) };
});
```

```js
$w.onReady(() => {
  $w('#repeater1').data = mockData;
  $w('#repeater1').forEachItem(($item, data) => {
    $item('#text1').text = data._id;
  });
});
```

```js
/**
 * @param {$w.Event} event
 */
const changePosition = (event) => {
  // TODO: ...
}

$w.onReady(() => {
  $w('#repeater1').data = mockData;
  $w('#repeater1').forEachItem(($item, data) => {
    $item('#text1').text = data._id;
  });

  $w('#buttonUp').onClick(changePosition);
  $w('#buttonDown').onClick(changePosition);
});
```

<details>
  <summary>Repeater Scope</summary>

  My post about this snippet [Event handling of Repeater Item](/event-handling-of-repeater-item)

```js
/**
 * Create Repeated Item Scope
 *
 * @see {@link https://github.com/shoonia/repeater-scope}
 *
 * @typedef {{
 *  _id: string;
 *  [key: string]: any;
 * }} ItemData;
 *
 * @typedef {{
 *   $item: $w.$w;
 *   itemData: ItemData;
 *   index: number;
 *   data: ItemData[];
 * }} ScopeData;
 *
 * @param {() => ItemData[]} getData
 * @returns {(event: $w.Event) => ScopeData}
 */
export const createScope = (getData) => (event) => {
  const itemId = event.context.itemId;
  const find = (i) => i._id === itemId;

  return {
    // @ts-ignore
    $item: $w.at(event.context),

    get itemData() {
      return getData().find(find);
    },

    get index() {
      return getData().findIndex(find);
    },

    get data() {
      return getData();
    },
  };
};
```
</details>

```js
import { createScope } from 'public/repeater-scope';

const useScope = createScope(() => {
  return $w('#repeater1').data;
});
```

```js
/**
 * @param {$w.Event} event
 */
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);
}
```

`event.target.id` - [gets the ID of the target element](https://www.wix.com/corvid/reference/$w/event/target)

```js
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);

  // "buttonUp" or "buttonDown"
  const id = event.target.id;
}
```

```js
const isUp = event.target.id === 'buttonUp';
```

```js
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);
  const isUp = event.target.id === 'buttonUp';

  const i = index + (isUp ? -1 : 1);
}
```

<img
  src="https://static.wixstatic.com/media/e3b156_1387facda12349c2817c2f736cfb2512~mv2.jpg"
  width="788"
  height="395"
  alt="schema of changing items index"
  loading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>

```js
/**
 * @param {number} index
 * @param {number} length
 */
const getIndex = (index, length) => {
  if (index === length) return 0;
  if (index < 0) return length;

  return index;
};
```

```js
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);
  const isUp = event.target.id === 'buttonUp';
  const i = index + (isUp ? -1 : 1);
  const newIndex = getIndex(i, data.length);
}

```

[`.splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

```js
data.splice(index, 1);
```

```js
data.splice(newIndex, 0, itemData);
```

```js
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);
  const isUp = event.target.id === 'buttonUp';
  const i = index + (isUp ? -1 : 1);
  const newIndex = getIndex(i, data.length);

  // Removes from data array current item by index
  data.splice(index, 1);
  // Pass current item to new index
  data.splice(newIndex, 0, itemData);

  // Refresh data to Repeater
  $w('#repeater1').data = data;
}
```

```js
import { timeline } from 'wix-animations';
```

```js
const options = {
  y: isUp ? '-=10' : '+=10',
  duration: 150,
};

const animation = timeline()
  .add($item('#container1'), options)
  .onComplete(() => {
    // When the animation is completed then we run it again reverse back
    animation.reverse();
  })
  .play();
```

```js
const animation = timeline()
  .add($item('#container1'), options)
  .onComplete(() => {
    $w('#repeater1').data = data;
    animation.reverse();
  })
  .play();
```

<details>
  <summary>Full page code</summary>

```js
import { timeline } from 'wix-animations';
import { createScope } from 'public/repeater-scope';

const mockData = Array.from({ length: 5 }, (_, i) => {
  return { _id: String(i) };
});

const useScope = createScope(() => {
  return $w('#repeater1').data;
});

/**
 * @param {number} index
 * @param {number} length
 */
const getIndex = (index, length) => {
  if (index === length) return 0;
  if (index < 0) return length;

  return index;
};

/**
 * @param {$w.Event} event
 */
const changePosition = (event) => {
  const { $item, itemData, index, data } = useScope(event);

  const isUp = event.target.id === 'buttonUp';
  const i = index + (isUp ? -1 : 1);
  const newIndex = getIndex(i, data.length);

  data.splice(index, 1);
  data.splice(newIndex, 0, itemData);

  const options = {
    y: isUp ? '-=10' : '+=10',
    duration: 150,
  };

  const animation = timeline()
    .add($item('#container1'), options)
    .onComplete(() => {
      $w('#repeater1').data = data;
      animation.reverse();
    })
    .play();
}

$w.onReady(() => {
  $w('#repeater1').data = mockData;
  $w('#repeater1').forEachItem(($item, data) => {
    $item('#text1').text = data._id;
  });

  $w('#buttonUp').onClick(changePosition);
  $w('#buttonDown').onClick(changePosition);
});
```
</details>
