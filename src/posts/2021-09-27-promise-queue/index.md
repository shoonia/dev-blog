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

<svg aria-label="find hand promise" viewBox="0 140 800 350" style="background-color:var(--c-link)"><path fill="#fff" d="M517 248c-6.943-5.355-13.755-10.52-19.816-16.911-3.81-4.018-7.36-9.682-13.184-10.807-11.662-2.252-11.212 7.385-14.178 14.433C464.546 247.249 460 258.858 460 273h-1c-2.674-5.733-7.941-9.75-11.48-15-7.432-11.027-9.384-22.985-25.52-20 6.439 42.986 37.537 68.821 65.91 97.961C512.218 360.928 534.22 388.22 559 413h1l2-2v-1l-50-52 13-1-1-4c-5.352 1.693-11.653 2.587-16.624-.938-6.646-4.711-11.609-14.145-17.391-20.062-11.287-11.552-25.278-21.107-35.086-34-5.093-6.695-15.99-16.836-10.899-25l-6 1-12-33 1-1c11.122 4.526 12.573 13.971 19.159 23 6.17 8.459 14.728 14.297 16.841 25 4.327-2.816 2.174-7.597 1.435-12-1.267-7.554-2.687-13.79 2.565-20l4 18 4-1c-2.284-8.054-4.873-16.693-5.94-25-.328-2.552-.066-8.28 3.945-7.634 7.042 1.133 5.809 12.826 11.995 14.634-.216-9.19-11.576-16.955-10.549-24.91.841-6.507 8.34-7.23 12.459-3.745 12.581 10.643 23.542 20.062 37.089 29.43 4.482 3.099 7.834 8.553 13.001 10.225-2.81-14.493-36.174-30.161-16-47 2.506 14.058 17.339 20.122 21.292 33 3.716 12.109 7.186 26.409 8.534 39 1.262 11.782-.525 23.334 2.664 35 2.198 8.04 7.713 14.711 12.945 21 11.887 14.288 28.197 34.147 46.565 40l1-3c-20.265-13.66-47.836-33.903-56.451-58-4.308-12.05-2.767-24.563-3.638-37-.886-12.638-4.449-29.152-8.94-41-4.587-12.101-17.167-21.751-22.971-34-15.41 5.283-9.499 23.179-5 34zM188 359l1 4c27.428-12.806 51.486-31.123 71-54l7 15h1l2-2v-1c-12.141-14.384-8.455-34.315-3.576-51 1.529-5.228 2.983-13.821 7.79-17.062 9.159-6.174 25.313-4.393 35.786-7.938 3.255 14.204-15.187 23.273-27 19l-1 4c5.598 1.333 10.548-.383 16 .225 3.623.405 6.537 3.139 10 4.137 9.712 2.799 15.985-2.535 22-9.362l-4 14c8.131-.366 5.2-8.712 8.028-13.83 1.863-3.372 6.006-5.168 7.086-9.063.61-2.199-.582-2.964-2.114-4.107-2.898 5.57-6.719 7.028-11.675 10.274-10.649 6.973-11.151 11.202-24.325 5.726v-1c11.701-5.833 22.186-17.549 33-25.29 3.613-2.587 9.224-8.353 13.985-8.114 4.66.234 6.07 5.629 6.138 9.404.17 9.41 1.13 23.661-3.656 31.996-2.423 4.218-7.019 6.358-8.467 11.004 15.583-2.823 14.415-25.93 33-24l1-1c-2.476-12.512 6.455-24.226 20-22-5.66 13.456-16.777 25.924-24.972 38-11.346 16.718-21.32 36.18-35.118 50.999-9.192 9.872-19.459 16.265-32.91 12.001l-1 4 6 1c-24.577 20.947-59.06 38.695-67 73l4 1c4.214-28.117 40.29-54.858 63-68.396 8.188-4.881 17.624-7.783 25-13.93 12.54-10.448 20.651-26.294 29.67-39.674 13.106-19.444 27.919-38.504 39.33-59-15.334-8.589-30.863 3.65-31 20l-15 7c3.055-10.336 5.578-43.88-13.998-33.674-2.517 1.312-4.754 2.96-7.002 4.674-3.471-14.607-12.788-10.663-23-5-1.507-7.44-8.286-9.939-15-6.427-8.943 4.677-14.128 15.04-20.665 22.318-2.565 2.856-6.729 3.476-8.972 6.423-11.733 15.421-5.832 37.325-12.896 53.686-10.312 23.883-45.899 43.463-68.467 54z"/><path fill="var(--c-link)" d="M284 246c11.044-1.427 17.85-8.352 27-14-4.752-17.99-23.404 6.781-27 14zM306.5 246c11.044-1.427 17.85-8.352 27-14-4.752-17.99-23.404 6.781-27 14z"/><path fill="#fff" d="m299 306 12-15c-10.107.45-11.375 14.684-24 12l-1 3c16.827 9.472 42.229-3.335 50-20l-1-1c-12.968 6.047-20.172 20.275-36 21z"/></svg>

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
    width="720"
    height="368"
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
    width="720"
    height="368"
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
    width="720"
    height="368"
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
