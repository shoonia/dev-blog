---
permalink: '/promise-queue/'
date: '2021-09-27T12:00:00.000Z'
modified: '2021-09-27T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Promise Queue'
description: "In this post, we look at concurrent hide/show animation behavior in Velo APIs. When one of the animation effects can't start because a previous one isn't finished yet."
image: '/assets/images/promise-hands-590x590.jpg'
---

# Velo by Wix: Promise Queue

*In this post, we look at concurrent [hide](https://www.wix.com/velo/reference/$w/hiddenmixin/hide)/[show](https://www.wix.com/velo/reference/$w/hiddenmixin/show) animation behavior in Velo APIs. When one of the animation effects can't start because a previous one isn't finished yet.*

<img
  src="/assets/images/promise-hands.jpg"
  alt="find hand promise"
/>

## What is the issue?

Let's suppose that we have to animate an image by mouse event. For example, we want to create a hover effect that combines mouse [in](https://www.wix.com/velo/reference/$w/element/onmousein)/[out](https://www.wix.com/velo/reference/$w/element/onmouseout) events.

<figure>
  <figcaption>
    <strong>Velo: hide/show animation by mouse event</strong>
  </figcaption>
  <video
    src="/assets/videos/promise-queue-2.mp4"
    type="video/mp4"
    preload="metadata"
    controls
    loop
  />
</figure>

Our realization will be very trivial. We have an [image](https://www.wix.com/velo/reference/$w/image) that has two event listeners on `onMouse{In/Out}` and a [vector image](https://www.wix.com/velo/reference/$w/vectorimage) that will be shown or hidden.

It's the next code snippet:

<figure>
  <figcaption>
    <strong>Velo: Add simple fade animation with a duration of 300 milliseconds</strong>
  </figcaption>

```js
$w.onReady(() => {
  const fadeOptions = {
    duration: 300,
  };

  $w('#imageParrot')
    .onMouseIn(() => {
      $w('#vectorHat').show('fade', fadeOptions);
    })
    .onMouseOut(() => {
      $w('#vectorHat').hide('fade', fadeOptions);
    });
});
```
</figure>

As you can see above, the animation has a duration of 300 ms. What happens if we move the cursor through in/out the image faster than 300 ms?

<figure>
  <figcaption>
    <strong>Velo: Glitch with show/hide animation</strong>
  </figcaption>
  <video
    src="/assets/videos/promise-queue-3.mp4"
    type="video/mp4"
    preload="metadata"
    controls
    loop
  />
</figure>

Yes, there is an issue. The next in the queue animation doesn't run if the previous one is going at the moment.

## Why does it happen?

Let's visualize a timeline of the animation's execution. For example, we have three events, `in -> out -> in`. The first animation starts at 0 it will be finishing at 300 ms. The second animation starts at 200 ms, but it will be skip because this element is animating at this moment. The third one starts at 300 ms that will successfully run because the first one has finished, the second one skipped so the element can animate again.

<figure>
  <figcaption>
    <strong>Visualization of mouse events in a timeline</strong>
  </figcaption>

```text
0 ms ── 100 ms ── 200 ms ── 300 ms ── 400 ms ── 500 ms ── 600 ms ── 700 ms
────────────────────────────────────────────────────────────────────────────

 .show() ───────────────────│ ✅ Done
                            │
              .̶h̶i̶d̶e̶(̶)̶ ......│ ❌ 🪲 Skipped
                            │
                            │ .show() ───────────────────│ ✅ Done
```
</figure>
<aside>

  *The Wix elements can't be animating with two concurrent (hide/show) animations on the same element at one time.*
</aside>

## How can we fix it?

We have to wait for the animation's end before running a new one. For this, we create a queue. We push each animation request to this queue, where animations will be calling one by one.

<figure>
  <figcaption>
    <strong>Visualization of the Promise queue in a timeline</strong>
  </figcaption>

```text
0 ms ── 100 ms ── 200 ms ── 300 ms ── 400 ms ── 500 ms ── 600 ms ── 700 ms
────────────────────────────────────────────────────────────────────────────

 .show() ───────────────────│ ✅ Done
                            │
              .hide() ......└────────────────────│ ✅ Done
                                                 │
                             .show() ............└────────────────────│ ✅ Done
```
</figure>

## Create a queue

Create a `queue.js` file in the `public` folder. In this file, we implement the queue logic.

First, we implement a mechanism for adding actions to the queue.

**public/queue.js**

```js
export const createQueue = () => {
  // Action list
  const actions = [];

  return (action) => {
    // Adds action to the end of the list
    actions.push(action);
  };
};
```

Тurn your attention we don't run animation when mouse event fired. Instead, we wrap it to function and push it to the array.

Let's upgrade the code on the page to see how it works.

**HOME Page (code)**

```js
import { createQueue } from 'public/queue.js';

$w.onReady(() => {
  // Initializing queue
  const queue = createQueue();

  const fadeOptions = {
    duration: 300,
  };

  $w('#imageParrot')
    .onMouseIn(() => {
      // Add actions to queue
      queue(() => $w('#vectorHat').show('fade', fadeOptions));
    })
    .onMouseOut(() => {
      // Add actions to queue
      queue(() => $w('#vectorHat').hide('fade', fadeOptions));
    });
});
```

Great, we have a list of actions. The next step, run the queue.

It will be an auxiliary function for the queue start.

**public/queue.js**

```js
export const createQueue = () => {
  const actions = [];

  const runQueue = () => {
    // Check: are we have any actions in queue
    if (actions.length > 0) {
      // Removes the first action from the queue
      // and returns that removed action
      const action = actions.shift();
      // Waits the promise
      action().then(() => {
        // When the Promise resolves
        // then it runs the queue to the next action
        runQueue();
      });
    }
  };

  return (action) => {
    actions.push(action);
    // Runs the queue when adding a new action
    runQueue();
  };
};
```

The `runQueue()` is the recursive function it runs itself after the promise has been resolved. Also, we trigger `runQueue()` by adding a new action. We have to limit the trigger it should run only once at the queue start.

Further, we add the flag for *closing* the `runQueue()` if the queue is active.

**public/queue.js**

```js
export const createQueue = () => {
  // Flag
  let isActive = false;

  const actions = [];

  const runQueue = () => {
    // Check: if the queue is running
    if (isActive) {
      // Stop this call
      return;
    }

    if (actions.length > 0) {
      const action = actions.shift();
      // Before: closes the queue
      isActive = true;

      action().then(() => {
        // After: opens the queue
        isActive = false;
        runQueue();
      });
    }
  };

  return (action) => {
    actions.push(action);
    runQueue();
  };
};
```

When a new action is adding to the list, we check the queue is active. If the queue is not active, we run it. If the queue is active, we do nothing.

## Queue length

The last thing we need is control of the queue length. We can create a lot of animation actions that could lead to a blink effect.

<figure>
  <figcaption>
    <strong>Velo: blink effect by a long Promise queue</strong>
  </figcaption>
  <video
    src="/assets/videos/promise-queue-1.mp4"
    type="video/mp4"
    preload="metadata"
    controls
    loop
  />
</figure>

The algorithm is simple. If the queue has a max length then we remove the last action before adding a new one.

<figure>
  <figcaption>
    <strong>Visualization of removing queue actions in a timeline</strong>
  </figcaption>

```text
0 ms ── 100 ms ── 200 ms ── 300 ms ── 400 ms ── 500 ms ── 600 ms ── 700 ms
────────────────────────────────────────────────────────────────────────────

 .show() ───────────────────│ ✅ Done
                            │
      .̶h̶i̶d̶e̶(̶)̶ ..............│ 🗑️ Removed
                            │
          .̶s̶h̶o̶w̶(̶)̶ ..........│ 🗑️ Removed
                            │
                .hide() ....└────────────────────│ ✅ Done
```
</figure>

Let's set a max length by default as one. I think it covered 99% of use cases.

**public/queue.js**

```js
// By default, the queue has one action
export const createQueue = (maxLength = 1) => {
  let isActive = false;

  const actions = [];

  const runQueue = () => {…};

  return (action) => {
    // Check: if the queue has max length
    if (actions.length >= maxLength) {
      // Removes the last action from the queue
      // before adds a new one
      actions.pop();
    }

    actions.push(action);
    runQueue();
  };
};
```

<figure>
 <figcaption>

  Check how it works on **Live Demo**
  </figcaption>
  <iframe
    src="https://alexanderz5.wixsite.com/promise-queue"
    title="Live Demo of Promise Queue in Velo"
    height="600"
  ></iframe>
</figure>

**That's it!** I hope it could be helpful to your projects. Thanks for reading.

## Code Snippets

Here are the whole code snippet plus JSDoc types.

<details>
  <summary>
    <strong>public/queue.js</strong>
  </summary>

```js
/**
 * Create a promise queue
 *
 * @typedef {() => Promise<unknown>} Action
 *
 * @param {number} [maxLength] - max count actions in the queue
 * @returns {(action: Action) => void}
 */
export const createQueue = (maxLength = 1) => {
  /** @type {boolean} */
  let isActive = false;

  /** @type {Action[]} */
  const actions = [];

  const runQueue = () => {
    if (isActive) {
      return;
    }

    if (actions.length > 0) {
      const action = actions.shift();

      isActive = true;

      action().then(() => {
        isActive = false;
        runQueue();
      });
    }
  };

  return (action) => {
    if (actions.length >= maxLength) {
      actions.pop();
    }

    actions.push(action);
    runQueue();
  };
};
```
</details>

Example of using:

<details>
  <summary>
    <strong>HOME Page (code)</strong>
  </summary>

```js
import { createQueue } from 'public/queue.js';

$w.onReady(() => {
  const queue = createQueue();

  const fadeOptions = {
    duration: 300,
  };

  $w('#imageParrot')
    .onMouseIn(() => {
      queue(() => $w('#vectorHat').show('fade', fadeOptions));
    })
    .onMouseOut(() => {
      queue(() => $w('#vectorHat').hide('fade', fadeOptions));
    });
});
```
</details>

## Resources

- [Live Demo](https://alexanderz5.wixsite.com/promise-queue)
- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promises, async/await](https://javascript.info/async)

## Posts

- [Short links to create a new Wix / Editor X site editor](/wix-velo-editorx-short-links/)
- [Custom pagination with unique URLs](/custom-pagination-with-unique-urls/)
- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/)
