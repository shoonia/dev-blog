---
publish: true
path: '/message-channel-to-iframe'
template: 'default'
date: '2020-12-12'
lang: 'en'
title: 'Corvid by Wix: Message channel to iFrame'
description: 'pp'
author: 'Alexander Zaytsev'
image: ''
---

# Corvid by Wix: Message channel to iFrame

**Corvid API to work with post messages**

```js
// Sends data to iFrame
$w('#html1').postMessage({ data: 123 });

// Listen messages from iFrame
$w('#html1').onMessage((event) => {
  console.log(event.data);
});
```

**Browser native API to work with post messages**

```js
// Sends data to Corvid
window.parent.postMessage({ data: 123 }, '*');

// Listen messages from Corvid
window.addEventListener('message', (event) => {
  console.log(event.data);
});
```

**iFrame Page**

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter</title>
</head>
<body>

  <!-- Simple HTML page with two buttons -->

  <button type="button" id="inc">
    Increment
  </button>

  <button type="button" id="dec">
    Decrement
  </button>

  <script>
    // JavaScript goes here
  </script>
</body>
</html>
```

<img
  src="https://static.wixstatic.com/media/e3b156_d4023e6aaee14a52b4957d8ff559ee1d~mv2.jpg"
  width="770"
  height="279"
  loading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>

```html
<script>
  let count = 5;
</script>
```

**iFrame Page**

```html
<script>
  const createChannel = () => {
    return {
      emit(type, payload) {
        window.parent.postMessage({ type, payload }, '*');
      }
    };
  };

  const channel = createChannel();

  let count = 5;

  // Emitting the initial event
  // Frame is ready
  channel.emit('@ready', count);
</script>
```

**public/channel.js**

```js
/**
 * @param {string} id
 */
export const createChannel = (id) => {
  // Subscriptions list
  const subs = [];

  return {
    on(type, cb) {
      // Adds new event listener
      subs.push({ type, cb });
    }
  };
};
```

**Home Page**

```js
import { createChannel } from 'public/channel';

// Initialization of channel
const channel = createChannel('#html1');

// Listens to the @ready event
// which we send from iFrame with initial data of the "count"
channel.on('@ready', (payload) => {
  $w('#text1').text = String(payload);
});
```

**Example of a dynamic event handler**

```js
$w.onReady(() => {
  // The page on ready for setting event handlers
  $w('#html1').onMessage((event) => {
    // Handling events
  });
});
```

**public/channel.js**

```js
/**
 * @param {string} id
 */
export const createChannel = (id) => {
  const subs = [];

  // @ts-ignore
  $w.onReady(() => {
    $w(id).onMessage((event) => {
      const data = event.data || {};

      subs.forEach((s) => {
        // If the current event type is equal to
        // one of the "type" in the subscription list
        // then we run a function callback with a "payload"
        if (s.type === data.type) {
          s.cb(data.payload);
        }
      });
    });
  });

  return {
    on(type, cb) {
      subs.push({ type, cb });
    }
  };
};
```

**iFrame Page**

```html
<script>
  const createChannel = () => {
    return {
      emit(type, payload) {
        window.parent.postMessage({ type, payload }, '*');
      }
    };
  };

  const channel = createChannel();

  const inc = document.querySelector('#inc');
  const dec = document.querySelector('#dec');

  let count = 5;

  inc.addEventListener('click', () => {
    channel.emit('@count', ++count);
  });

  dec.addEventListener('click', () => {
    channel.emit('@count', --count);
  });

  channel.emit('@ready', count);
</script>
```

**Home Page**

```js
import { createChannel } from 'public/channel';

const channel = createChannel('#html1');

channel.on('@ready', (payload) => {
  $w('#text1').text = String(payload);
});

channel.on('@count', (payload) => {
  $w('#text1').text = String(payload);
});
```

See how it works: **[Live Demo](https://shoonia.wixsite.com/blog/channel)**

## Source Code

We implemented half of the channel API in the iFrame page `channel.emit()` and another one `channel.on()` in Corvid public file. Represented below are complete functions `createChannel()` for both sides Covid and iFrame.

<details>
  <summary>
    <strong>iFrame Page Source</strong>
  </summary>

The example code used the [`ECMAScript 2015 (ES6)`](https://en.wikipedia.org/wiki/ECMAScript) version of JavaScript. Be attention, the code inside iFrame doesn't transpile to the older version of JavaScript `(ES5)` and don't have a polyfills. Check a list of supported browser your project:

[Support for the ECMAScript 2015 specification.](https://caniuse.com/?search=es6)

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iFrame</title>
</head>
<body>

  <button type="button" id="inc">
    Increment
  </button>

  <button type="button" id="dec">
    Decrement
  </button>

  <script>
    /**************************************** */
    /**************************************** */
    const createChannel = () => {
      const subs = [];

      window.addEventListener('message', (event) => {
        const data = event.data || {};

        subs.forEach((s) => {
          if (s.type === data.type) {
            s.cb(data.payload);
          }
        });
      });

      return {
        on(type, cb) {
          subs.push({ type, cb });
        },

        emit(type, payload) {
          window.parent.postMessage({ type, payload }, '*');
        }
      };
    };
    /**************************************** */
    /**************************************** */

    const channel = createChannel();

    const inc = document.querySelector('#inc');
    const dec = document.querySelector('#dec');

    let count = 5;

    inc.addEventListener('click', () => {
      channel.emit('@count', ++count);
    });

    dec.addEventListener('click', () => {
      channel.emit('@count', --count);
    });

    channel.emit('@ready', count);
  </script>
</body>
</html>
```

</details>

<details>
  <summary>
    <strong>public/channel.js</strong>
  </summary>

```js
/**
 * @param {string} id
 */
export const createChannel = (id) => {
  const subs = [];

  // @ts-ignore
  $w.onReady(() => {
    $w(id).onMessage((event) => {
      const data = event.data || {};

      subs.forEach((s) => {
        if (s.type === data.type) {
          s.cb(data.payload);
        }
      });
    });
  });

  return {
    on(type, cb) {
      subs.push({ type, cb });
    },

    emit(type, payload) {
      $w(id).postMessage({ type, payload });
    }
  };
};
```

</details>

<details>
  <summary>
    <strong>Home Page (code)</strong>
  </summary>

```js
import { createChannel } from 'public/channel';

const channel = createChannel('#html1');

channel.on('@ready', (payload) => {
  $w('#text1').text = String(payload);
});

channel.on('@count', (payload) => {
  $w('#text1').text = String(payload);
});
```

</details>


## Posts

- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
