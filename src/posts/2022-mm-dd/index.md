---
permalink: '/xyz/'
date: '2022-01-23T12:00:00.000Z'
modified: '2022-01-23T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Type safety your code with JSDoc'
description: ''
image: '/assets/images/velo.png'
---

# Velo by Wix: Type safety your code with JSDoc

![concept art by movie - interstellar](/assets/images/ins.jpg)

[Velo currently uses a TypeScript compiler for autocomplete and code validations.](https://www.wix.com/velo/forum/tips-tutorials-examples/cannot-redeclare-block-scoped-variable-validation-error)


**public/initPage.js**

```js
// Filename: public/initPage.js

export function initPage() {
  /** @type {$w.Button} */
  const button = $w('#button1');

  /** @type {$w.TextInput} */
  const input = $w('#input1');

  /** @type {$w.Text} */
  const text = $w('#text1');

  // your code goes here ...
}
```

**public/initPage.js**

```js
// Filename: public/initPage.js

/**
 * @param {$w.Button} button
 * @param {$w.TextInput} input
 */
export function initPage(button, input) {
  button.onClick(() => { });

  input.onInput(() => { });

  // your code goes here ...
}
```

<figure>
  <figcaption>
    <strong>Velo: autocomplete suggestion list</strong>
  </figcaption>
  <img
    src="/assets/images/jsdoc1.jpg"
    alt="autocomplete suggestions in velo editor"
    loading="lazy"
  />
</figure>

<kbd>↑</kbd> <kbd>↓</kbd> <kbd>↵ Enter</kbd>

<figure>
  <figcaption>
    <strong>Velo: type error, a function expect an <code>$w.TextInput</code> element</strong>
  </figcaption>
  <img
    src="/assets/images/jsdoc2.jpg"
    alt="annotation type error with jsdoc in velo editor"
    loading="lazy"
  />
</figure>

**public/initPage.js**

```js
// Filename: public/initPage.js

/**
 * @param {{
 * button: $w.Button;
 * input: $w.TextInput;
 * text: $w.Text;
 * box: $w.Box;
 * }} options
 */
export function initPage({
  button,
  input,
  text,
  box,
}) {
  button.onClick(() => { });

  input.onInput(() => { });

  // your code goes here ...
}
```

<figure>
  <figcaption>
    <strong>Video</strong>
  </figcaption>
  <video
    src="/assets/videos/jsdoc1.mp4"
    type="video/mp4"
    preload="metadata"
    width="1280"
    height="576"
    controls
    loop
  />
</figure>

## Resources

- [Official documentation for JSDoc 3](https://jsdoc.app/)
- [TypeScript: Documentation - JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
