---
permalink: '/xyz/'
date: '2022-01-23T12:00:00.000Z'
modified: '2022-01-23T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Type safety your code with JSDoc'
description: ''
image: '/assets/images/ins.jpg'
---

# Velo by Wix: Type safety your code with JSDoc

![concept art by movie - interstellar](/assets/images/ins.jpg)

From time to time, I can see in the big Velo project how part of the page code moves to the public files. In most, it's the projects with a few thousand lines of code. I understand why we do it. Also, sometimes we want to reuse some part of the code for a few site pages.

The main problem with this pattern is that doesn't work autocomplete and ID checking for `$w()` selector in the public files. For example, I want to move a button handler to the public file. In the page code, I just init it.

**Page code**

```js
import { initPage } from 'public/initPage.js';

$w.onReady(() => {
  initPage();
});
```

In the public files, we can see that don't work all hints for `$w()` selector and page elements.

**public/initPage.js**

```js
// Filename: public/initPage.js

export const initPage = () => {
  // 1. Autocomplete for ID suggestions doesn't work
  // 2. The checking of an element ID doesn't work.
  // 3. If the element with this ID doesn't exist on the page
  //    we don't have any error messages in editor.
  // 4. button mark as `any` type
  const button = $w('#button1');

  // 1. Autocomplete doesn't work.
  // 2. Type checking doesn't work.
  button.onClick(() => {});
}
```

For me, it's the main reason for don't use this pattern. The element could be removed or renamed at any time, but we don't have any editor hints, errors, or warnings to catch it. Only runtime errors.

However, this pattern is very commonly used. So, let's do it a little bit safer.

## Why does it happen?

Firstly, the public files don't design for using the `$w()` selector. The Velo editor autocomplete mechanism doesn't know how we plan to use your public file. Because you can import public files to any kind of files, to any pages, and also you can import a public file to the backend files.

Velo uses a [TypeScript](https://www.typescriptlang.org/) compiler for autocomplete and code validations. Each page code has built-in types for autocomplete and validations of the editor elements.

<aside>
<a href="https://www.wix.com/velo/forum/tips-tutorials-examples/cannot-redeclare-block-scoped-variable-validation-error">Velo currently uses a TypeScript compiler for autocomplete and code validations</a>
</aside>

The types of page elements are generated automatically, when we add/remove any element to the page, Velo adds/removes a property for the `PageElementsMap` interface. The `PageElementsMap` interface is unique for each page. We to able to use this interface with [JSDoc](https://jsdoc.app/) types annotation.

For example, I will use a [TypeScript JSDoc syntax](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) for type annotation in the next code snippet.

**HOME Page**

```js
/**
 * @template {keyof PageElementsMap} T
 *
 * @param {T} selector
 * @param {$w.EventHandler} eventHandler
 * @returns {PageElementsMap[T]}
 */
const clickHandler = (selector, eventHandler) => {
  const element = $w(selector);

  element.onClick(eventHandler);

  return element;
}

// You can see this function has all autocomplete for params
clickHandler('#button1', (event) => {
  console.log(event);
});
```

If you try to use this code snippet on any page code files, you can see that it has all type checking and autocomplete for arguments. It's amazing, but we still can't use it on the public files, because the `PageElementsMap` interface exists only on the page code files.

## How can we use a JSDoc on public files?

As we can see above, the autocomplete of the `$w()` selector doesn't work on the public files because TypeScript doesn't know about the context of the public file use. It can be any page, and also we can import a public file to the backend code.

So, we should describe for TypeScript the types that we want to use.

### @type tag

Let's start with the simple use case, it's a `@type` tag.

The syntax of JSDoc it's a block comment that starts with `/**` and ends with `*/`. Inside block comment, we use a tag keyword that starts with `@` symbol after the tag inside curly braces `{type}` we write a type.

Just try to write the next snippet code in Velo editor without copy-pasting. You can ensure, the Velo provides autocomplete and syntax validation for JSDoc too.

**Velo: simple example of @type tag**

```js
/** @type {$w.Button} */
const button = $w('#button1');
```

`$w.Button` it's a built-in type. Velo has built-in types for all page elements.

<details>
  <summary>
    <strong>Wix element types</strong>
  </summary>
  <aside>

  Source: [Type definitions for Velo by Wix](https://runkit-packages.com/14.x.x/1641656995847/corvid-types/types/pages/$w.d.ts)
  </aside>

```ts
declare type TypeNameToSdkType = {
    AccountNavBar: $w.AccountNavBar;
    Anchor: $w.Anchor;
    Box: $w.Box;
    Button: $w.Button;
    Checkbox: $w.Checkbox;
    CheckboxGroup: $w.CheckboxGroup;
    Column: $w.Column;
    ColumnStrip: $w.ColumnStrip;
    Container: $w.Container;
    DatePicker: $w.DatePicker;
    Document: $w.Document;
    Dropdown: $w.Dropdown;
    Footer: $w.Footer;
    Gallery: $w.Gallery;
    GoogleMap: $w.GoogleMap;
    Header: $w.Header;
    HtmlComponent: $w.HtmlComponent;
    IFrame: $w.IFrame;
    Image: $w.Image;
    MediaBox: $w.MediaBox;
    Menu: $w.Menu;
    MenuContainer: $w.MenuContainer;
    Page: $w.Page;
    QuickActionBar: $w.QuickActionBar;
    RadioButtonGroup: $w.RadioButtonGroup;
    Repeater: $w.Repeater;
    Slide: $w.Slide;
    Slideshow: $w.Slideshow;
    Table: $w.Table;
    Text: $w.Text;
    TextBox: $w.TextBox;
    TextInput: $w.TextInput;
    UploadButton: $w.UploadButton;
    VectorImage: $w.VectorImage;
    Video: $w.Video;
    VideoBox: $w.VideoBox;
    AddressInput: $w.AddressInput;
    AudioPlayer: $w.AudioPlayer;
    Captcha: $w.Captcha;
    Pagination: $w.Pagination;
    ProgressBar: $w.ProgressBar;
    RatingsDisplay: $w.RatingsDisplay;
    RatingsInput: $w.RatingsInput;
    RichTextBox: $w.RichTextBox;
    Slider: $w.Slider;
    Switch: $w.Switch;
    TimePicker: $w.TimePicker;
    VideoPlayer: $w.VideoPlayer;
};


// the first part of this file is being generated by => scripts/selector-declaration-builder.js
// Run `npm run generate-dts` to generate it
declare type IntersectionArrayAndBase<T, P> = {
    [K in keyof T]: K extends P ? T[K] : T[K] & T[K][];
};


declare type TypeSelectorMap = IntersectionArrayAndBase<TypeNameToSdkType, 'Document'>;
declare type WixElements = PageElementsMap & TypeSelectorMap
declare type NicknameSelector = keyof PageElementsMap
declare type TypeSelector = keyof TypeSelectorMap

declare type WixElementSelector = NicknameSelector | TypeSelector
declare type IsWixElementSelector<S> = S extends WixElementSelector ? WixElements[S] : never;
/**
 * Selects and returns elements from a page.
 */
declare function $w<T extends WixElementSelector, S extends string>(selector: T | S & IsWixElementSelector<S>):
    S extends keyof WixElements
        ? WixElements[S]
        : any
/**
 * The `$w` namespace contains everything you need in order to work
 with your site's components.
 */
declare namespace $w {
    /**
	 * Gets a selector function for a specific context.
	 */
	 function at(context: $w.Event.EventContext): $w.$w;

	/**
	 * Sets the function that runs when all the page elements have finished loading.
	 */
	 function onReady(initFunction: $w.ReadyHandler): void;


    /**
     * Selects and returns elements from a page.
     */
    type $w = <T extends WixElementSelector, S extends string>(selector: T | S & IsWixElementSelector<S>) =>
        S extends keyof WixElements
            ? WixElements[S]
            : any
}
```
</details>

The main benefits of the element types, we can use it on the public files. In the simple use case, we just add a type annotation to all elements that we want to use in the public file.

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

Here, we solve a problem with autocomplete suggestions for elements methods in the public files. But in this approach, we don't solve the issue when an element is removed from the page.

We just say to TypeScript - *"Hey TS, I know it is the button. Just trust me and work with this element as the button"*.

It's not the best solution. But it's doing our dev experience better, than working without any types.

### @param tag

**public/initPage.js**

```js
// Filename: public/initPage.js

/**
 * @param {$w.Button} button
 * @param {$w.TextInput} input
 */
export function initPage(button, input) {
  // your code goes here ...

  button.onClick(() => { /*...*/ });

  input.onInput(() => { /*...*/ });
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
  // your code goes here ...

  button.onClick(() => { /*...*/ });

  input.onInput(() => { /*...*/ });
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
