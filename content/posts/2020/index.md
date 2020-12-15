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

*In this post, we consider how to build a scalable message channel for a large number of events between Corvid and iFrame.*

<img
  src="https://static.wixstatic.com/media/e3b156_8466d2a5924640ecb8e6cf41e1151d1b~mv2.png"
  width="920"
  height="380"
  alt="mountain chain"
  crossorigin="anonymous"
/>

One of the powerful tools for customization Wix Sites it's a [HtmlComponent](https://www.wix.com/corvid/reference/$w/htmlcomponent) (iFrame). The Corvid provides the API to interactions with `HtmlComponent`, which are sending and listening messages. Inside iFrame, we can use the native browser API represent in the global object `window` that provides the same functionality of sending and listening messages.

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

Using these simple APIs we can share data/events between our pages. For most cases, when we have a few events that enough.

```js
// Sends event with some payload
channel.emit('@event/name', { data: 1 });

// Listen the event
channel.on('@event/name', ({ data }) => {
  console.log(data);
});
```

### Terminology

For the avoiding of a mess, I will add the prefix `@iframe/*` for all event which will fire from the iFrame page. And all events which will fire from the main page will have the prefix `@main/*`.

Let's see an example of how looks at the communication between the Main page and iFrame. When iFrame is load then it sends to the Main page the event <mark>ready</mark>. By on the <mark>ready</mark> event, the Main page start to fetch collection items, and when the collection items ready, the Main page to send items to iFrame

**Example of communication between pages**

```js
/******************** iFrame ********************/

// Send initial event to Main page
channel.emit('@iframe/ready');

// Get the collection items from the main page
channel.on('@main/goods', (items) => {
  // ...
});

/******************** Main Page ********************/

// Get init event from iFrame
channel.on('@iframe/ready', () => {
  // Retrieve the items from a collection.
  wixData.query('goods').find().then((data) => {
    // Send the items to iFrame
    channel.emit('@main/goods', data.items);
  });
});
```

How you can see above the Main page handle events from iFrame and vice versa.

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

  <button type="button" id="dec">
    - Decrement
  </button>

  <button type="button" id="inc">
    + Increment
  </button>

  <script>
    // JavaScript goes here
  </script>
</body>
</html>
```

<img
  src="https://static.wixstatic.com/media/e3b156_fc6d952923c043a59a8c85903550c227~mv2.jpg"
  width="770"
  height="279"
  alt="Example of HTML embed Component"
  loading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>

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

  // Emit the initial event
  // iFrame is ready
  channel.emit('@iframe/ready');
</script>
```

**public/channel.js**

```js
/**
 * @param {string} id
 */
export const createChannel = (id) => {
  const events = {};

  return {
    on(type, cb) {
      // Create an empty subscription list
      // for a new event type if it needs
      if (!Array.isArray(events[type])) {
        events[type] = [];
      }

      // Add the callback to subscription list
      events[type].push(cb);
    },
  };
};
```

**Home Page**

```js
import { createChannel } from 'public/channel';

// Initialization of channel
const channel = createChannel('#html1');

// Listen to the init event from iFrame
channel.on('@iframe/ready', (payload) => {
  // Shows the element
  $w('#text1').show();
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
  const events = {};

  // @ts-ignore
  $w.onReady(() => {
    $w(id).onMessage((ev) => {
      const data = ev.data || {};
      const subs = events[data.type];

      // Check having is the subscription for this event type
      if (Array.isArray(subs)) {
        // Run all callback functions with payload
        subs.forEach((cb) => {
          cb(data.payload);
        });
      }
    });
  });

  return {
    on(type, cb) {
      if (!Array.isArray(events[type])) {
        events[type] = [];
      }

      events[type].push(cb);
    },
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

  let count = 0;

  inc.addEventListener('click', () => {
    // Increment the count
    channel.emit('@iframe/count', ++count);
  });

  dec.addEventListener('click', () => {
    // Decrement the count
    channel.emit('@iframe/count', --count);
  });

  channel.emit('@iframe/ready');
</script>
```

**Home Page**

```js
import { createChannel } from 'public/channel';

const channel = createChannel('#html1');

channel.on('@iframe/ready', () => {
  $w('#text1').show();
});

channel.on('@iframe/count', (count) => {
  $w('#text1').text = String(count);
});
```

See how it works: **[Live Demo](https://shoonia.wixsite.com/blog/channel)**

## Source Code

We implemented sending events from iFrame `channel.emit()` and listening events in the Corvid `channel.on()`. Below you can see full APIs for both sides of the channel.

**Code Snippets**

<details>
  <summary>
    <strong>iFrame Page Source</strong>
  </summary>

The example code used the [`ECMAScript 2015 (ES6)`](https://en.wikipedia.org/wiki/ECMAScript) version of JavaScript. Be attention, the code inside iFrame doesn't transpile to the older version of JavaScript `(ES5)` and don't have a polyfills. Check a list of supported browsers to your project:

[Support for the ECMAScript 2015 specification.](https://caniuse.com/?search=es6)

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iFrame</title>
</head>
<body>

  <button type="button" id="dec">
    - Decrement
  </button>

  <button type="button" id="inc">
    + Increment
  </button>

  <script>
    const createChannel = () => {
      const events = {};

      window.addEventListener('message', (ev) => {
        const data = ev.data || {};
        const subs = events[data.type];

        if (Array.isArray(subs)) {
          subs.forEach((cb) => {
            cb(data.payload)
          });
        }
      });

      return {
        on(type, cb) {
          if (!Array.isArray(events[type])) {
            events[type] = [];
          }

          events[type].push(cb);
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

    let count = 0;

    inc.addEventListener('click', () => {
      channel.emit('@iframe/count', ++count);
    });

    dec.addEventListener('click', () => {
      channel.emit('@iframe/count', --count);
    });

    channel.emit('@iframe/ready');
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
  const events = {};

  // @ts-ignore
  $w.onReady(() => {
    $w(id).onMessage((ev) => {
      const data = ev.data || {};
      const subs = events[data.type];

      if (Array.isArray(subs)) {
        subs.forEach((cb) => {
          cb(data.payload);
        });
      }
    });
  });

  return {
    on(type, cb) {
      if (!Array.isArray(events[type])) {
        events[type] = [];
      }

      events[type].push(cb);
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

channel.on('@iframe/ready', () => {
  $w('#text1').show();
});

channel.on('@iframe/count', (count) => {
  $w('#text1').text = String(count);
});
```

</details>

## Improve

```js
// able to listen and emit the events inside own page
emit(type, payload) {
  $w(id).postMessage({ type, payload });

  const subs = events[type];

  // check the own subscribers
  if (Array.isArray(subs)) {
    subs.forEach((cb) => {
      cb(payload);
    });
  }
}
```

```js
on(type, cb) {
  if (!Array.isArray(events[type])) {
    events[type] = [];
  }

  events[type].push(cb);

  // The method of subscribing returns the function of unsubscribing
  return () => {
    events[type].filter((i) => i !== cb);
  };
},
```

```js
const off = channel.on('@some/event', () => { });

off();
```

## Posts

- [Side effect wix-data saving methods](/side-effect-data-saving-methods/)
- [Smaller bundle size by importing npm package correctly](/smaller-bundle-size-by-importing-npm-package-correctly/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
