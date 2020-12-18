---
publish: true
path: '/message-channel-to-iframe'
template: 'default'
date: '2020-12-12'
lang: 'en'
title: 'Corvid by Wix: Message channel to iFrame'
description: 'In this post, we consider building a scalable message channel for large numbers of events between Corvid and iFrame using the Event and Listener model.'
author: 'Alexander Zaytsev'
image: ''
---

# Corvid by Wix: Message channel to iFrame

*In this post, we consider building a scalable message channel for large numbers of events between Corvid and iFrame using the Event and Listener model.*

<img
  src="https://static.wixstatic.com/media/fd206f_7e11f7f25f1949cab357c6c9fb7f89f0~mv2.jpg"
  width="729"
  height="254"
  alt="mountain chain"
  crossorigin="anonymous"
/>

The Wix allows embedding the [HtmlComponent (iFrame)](https://www.wix.com/corvid/reference/$w/htmlcomponent) to the page. It's one of the powerful tools for customization of your site when you need a very specific UI. The Corvid provides the API for interactions with HtmlComponent, which are sending and listening messages. Inside iFrame, we can use the native browser API represent in the global object `window` that provides the same functionality of sending and listening messages.

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

Using these simple APIs we can share data/events between our pages. For most cases, when we have a few events that enough. But when we have the count of events type that starts to grow then we should use a good abstraction.

I like the Event and Listener model. This model builds on two methods `.emit()` for fire the events and `.on()` for listening to the events.

**Example of Event Emitter:**

```js
// Sends event with some payload
channel.emit('@event/name', { data: 1 });

// Listen the event
channel.on('@event/name', ({ data }) => {
  console.log(data);
});
```

In this post, we consider building a scalable message channel for large numbers of events between Corvid and iFrame using the Event and Listener model.

## Terminology

To the avoiding of a mess, I'm going to use a convention of naming pages:

- The Main page - a page where we use the Corvid API.
- The iFrame page - a page inside `HtmlComponent` where we use the `window` object.

Events:

- All events which will fire from the iFrame will have the prefix `@iframe/*`.
- And all events which will fire from the Main page will have the prefix `@main/*`.

### API

Let's see an example of how to look like the communication between the Main page and iFrame.

Steps:

- When iFrame is load then it sends to the Main page the event <mark>ready</mark>.
- Main page gets the <mark>ready</mark> event and starts to fetch collection items.
- When the collection items ready, Main page sends items to iFrame
- iFrame gets the items

**Example of communication between pages**

```js
/******************** iFrame Page ********************/

// Send initial event to Main page
channel.emit('@iframe/ready');

// Get the collection items from the main page
channel.on('@main/goods', (items) => {
  // ...
});

/******************** iFrame End ********************/

/******************** Main Page ********************/

// Get init event from iFrame
channel.on('@iframe/ready', () => {
  // Retrieve the items from a collection.
  wixData.query('goods').find().then((data) => {
    // Send the items to iFrame
    channel.emit('@main/goods', data.items);
  });
});
/******************** Main End ********************/
```

How you can see above, the Main page listens to events from iFrame and vice versa the iFrame listens to events from the Main page.

All event objects will build with two properties:

- `type: string` *(required)* - the type of event
- `payload?: any` *(optional)* - any data which we want to send

**Example of event object**

```json
{
  "type": "@event/name",
  "payload": { "xyz": 123 }
}
```

Both pages will have the same interface of the channel. The method `channel.emit()` accepts `"type"` as the first argument and `payload` as the second one. The method `channel.on()` accepts `"type"` as the first argument and callback function with `payload` as the second one.

## Implementation of channel

I will use a very simple example with the counter. On the Main page, we have a hidden Text component. On iFrame, we have two buttons, increment, and decrement.

<img
  src="https://static.wixstatic.com/media/e3b156_fc6d952923c043a59a8c85903550c227~mv2.jpg"
  width="770"
  height="279"
  alt="Example of HTML embed Component"
  loading="lazy"
  decoding="async"
  crossorigin="anonymous"
/>

### Add iFrame

Here is a snippet of the iFrame page. Below we will write the code inside `<script>` tags

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

The channel will be created using the function `createChannel()`. When the iFrame page loaded, then we send the event `"@iframe/ready"`.

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

Look like simple. We put on the type and payload into the object and sending it to the Main page.

### Catch the event

Let's move to the Main page, and implement the channel for listening to.

The channel on Main page will create in the same way as we do it on iFrame. But we can have a few iFrames on the page or we can have a few pages on the site where we use the iFrames. That means the better place for the channel it's a public file.

**Create a `channel.js` in public folder:**

```file-tree
public/
└── channel.js
```

Method `channel.on()` accepts the subscription type and a callback function. We need to save callbacks in the associate group and run the callback functions whenever the subscribe event is coming.

Saving the callback functions in an array allows us to subscribe a few callbacks to one event type.

**Example of subscriptions container:**

```js
const events = {
  "@event/one": [ () => {} ],
  "@event/two": [ () => {} ],
};
```

So, above we speculated that we can have a few iFames.

**public/channel.js**

```js
/**
 * @param {string} id
 */
export const createChannel = (id) => {
  // Container to hold the events subscription
  const events = {};

  return {
    on(type, cb) {
      // Check, are the events already have a list for this type of event
      if (!Array.isArray(events[type])) {
        // Create an empty subscription list for a new event type
        events[type] = [];
      }

      // Add the callback to subscription list
      events[type].push(cb);
    },
  };
};
```

Let's take a look at how we can create a channel.

**Home Page**

```js
import { createChannel } from 'public/channel';

// Initialization of channel
// Pass the ID of HtmlComponent
const channel = createChannel('#html1');

// Listen to the init event from iFrame
channel.on('@iframe/ready', () => {
  // Shows the Text element
  $w('#text1').show();
});
```

We must wait until the page is ready.

**Example of a dynamic event handler**

```js
// Wait for the page is ready
$w.onReady(() => {
  // The page is ready for setting event handler
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
emitAll(type, payload) {
  $w(id1).postMessage({ type, payload });
  $w(id2).postMessage({ type, payload });
},
```

```js
// able to listen and emit the events inside own page
emit(type, payload) {
  const subs = events[type];

  // check the own subscribers
  if (Array.isArray(subs)) {
    subs.forEach((cb) => {
      cb(payload);
    });
  }

  $w(id).postMessage({ type, payload });
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
