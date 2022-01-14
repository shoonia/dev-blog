---
path: '/velo-query-selector-for-child-elements'
date: '2022-01-08T12:00:00.000Z'
modified: '2022-01-08T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Query selector for child elements'
description: 'Get the child elements inside a parent node. In this post, we take a look deeper at $w() selector and try to filter children elements by the specific parent node.'
author: 'Alexander Zaytsev'
image: 'https://shoonia.site/assets/images/load-editor.jpeg'
---

# Velo by Wix: Query selector for child elements

*Get the child elements inside a parent node. In this post, we take a look deeper at `$w()` selector and try to filter children elements by the specific parent node*

<img
  src="/assets/images/december1994.jpg"
  alt="concept art by television serial - tales from the loop"
  width="1024"
  height="421"
/>

Let's suppose we have a few containers with checkboxes in each of them. We don't know how many checkboxes will be in each container at the final design.

Each container has a "select all" named checkbox that allows us to check on/off all checkboxes into a current target container.

We want to provide a good abstract solution for avoiding hard coding of elements' ID. And ensure scaling for any count of the elements in the future.

<figure>
  <figcaption>
    <strong>Example of two groups with checkboxes</strong>
  </figcaption>
  <img
    src="/assets/images/yellow-blue.jpg"
    alt="Wix Editor with two box groups"
    width="1500"
    height="600"
    loading="lazy"
    style="border:1px solid rgb(112 128 144 / 40%);border-radius:8px"
  />
</figure>

In general, we need to find a way to query select all child elements into a specific parent node. There are exist similar selectors in DOM and CSS.

## CSS selector work from right to left

Take a look at the CSS works in this case. If you are familiar with CSS selectors, you can see that they work from right to left.

For example, we want to apply styles for all `<span>` child elements into parent nodes that have `.content-box` class name:

```html
<style>
/* Find all <span> element in ".content-box" elements */
.content-box span {
  font-weight: bold;
  color: seagreen;
}
</style>
<!--
  Browser matches the selectors from right to left.
  The first, browser find all <span> element on the page
  then browser filter only <span> elements
  that have a parent element with the class="content-box"
-->
<p class="content-box">
  CSS selector work from <span>right</span> to <span>left</span>
</p>
```

**Reslut:**

<div style="border:1px solid rgb(112 128 144/40%);border-left:6px solid rgb(112 128 144/40%);padding:0 1em">
  <style>
  .content-box span {
    font-weight: bold;
    color: seagreen;
  }
  </style>
  <p class="content-box">
    CSS selector work from <span>right</span> to <span>left</span>
  </p>
</div>

Under the hood, a browser uses the *"from right to left"* algorithm to select child elements. The browser literally starts to find all `<span>` elements on the page and then the browser filters only the `<span>` that have a parent node with `class="content-box"`.

<aside>

  More: [Why do browsers match CSS selectors from right to left?](https://stackoverflow.com/questions/5797014/why-do-browsers-match-css-selectors-from-right-to-left/5813672#5813672)
</aside>

So, in our task we need to do this two steps:

1. Query select all needed elements by type
2. Filter only elements that have a parent element with a specific ID.

Thinking about it, let's try to reproduce this query selector for Velo.

## Child selector for Velo

I propose using the *"from right to left"* search for our task. Especially we have all needed API for this.

In one of my previous posts, we solved a very similar issue. There we have created a tiny library for [getting a parent Repeater element from repeated items](/the-utils-for-repeated-item-scope-event-handlers).

### Select elements by type

<figure>
  <figcaption>

  In Velo, we have an API for [getting all elements on the page by type](https://www.wix.com/velo/reference/$w/$w#:~:text=To%20select%20by%20type%2C%20pass%20a%20selector%20string%20with%20the%20name%20of%20the%20type%20without%20the%20preceding%20%23%20(e.g.%20%22Button%22).%20The%20function%20returns%20an%20array%20of%20the%20selected%20element%20objects.%20An%20array%20is%20returned%20even%20if%20one%20or%20no%20elements%20are%20selected).

  <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/$w">
    To select by type, pass a selector string with the name of the type without the preceding `#` (e.g. "Button"). The function returns an array of the selected element objects. An array is returned even if one or no elements are selected.
  </blockquote>
</figure>

For example, we can get a list of elements and manipulate this group's methods.

**Select elements by type:**

<figure>

```js
// Gets all buttons on the page
const buttonElements = $w('Button');
// Disable all buttons
buttonElements.disable();

// Gets all text elements on the page
const textElemets = $w('Text');
// Rewrite all text elements on the page
textElemets.text = 'Hello';
```
  <figcaption>

  Each editor element has its own type. In Velo, API Reference documentation describes a small piece of [the possible editor elements type](https://www.wix.com/velo/reference/$w/element/type). It's not a full list.
  </figcaption>
</figure>

Fortunately, all type definitions for Velo APIs are available on the open source. We can find it on the [GitHub repository](https://github.com/wix-incubator/corvid-types) or [npm package](https://www.npmjs.com/package/corvid-types).

<details>
  <summary>
    <strong>Full list of the possible Wix element types</strong>
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
```
</details>

### Get the parent element and the parent's ID

We can get a parent element with the self-titled property. The top-level elements [Page](https://www.wix.com/velo/reference/$w/page), [Header](https://www.wix.com/velo/reference/$w/header), and [Footer](https://www.wix.com/velo/reference/$w/footer) have no parent.

```js
// Gets a checkbox's parent element
const parentElement = $w('#checkboxAllYellow').parent;

// Gets the parent element's ID
const parentId = parentElement.id; // "boxYellow"
```

<aside>

  **Pay Attention!**

  The `id` property return element ID without preceding hash (`#`) symbol

  ```js
  $w('#boxYellow').id; // => "boxYellow"
  ```
</aside>

## Realization

I guess it's enough theory by now. Let's start to implement a selector function.

Our selector will have the next signature. `findIn()` will be accepted a parent element ID and return an object with method `all()` that accepts searched children elements type.

```js
// Find in #boxYellow element all child elements with type `$w.Checkbox`
findIn('#boxYellow').all('Checkbox');
```

First, we get all child elements:

```js
export const findIn = (selector) => {
  return {
    all(type) {
      /** @type {*} */
      const elements = $w(type);
    },
  };
};
```
The `$w(type)` selector returns an array of elements. We transform this array to an array with ID's. Then we create a new multiple select from a joined list of IDs.
```js
export const findIn = (selector) => {
  return {
    all(type) {
      /** @type {any} */
      const elements = $w(type);

      // Gets an array with elements ID
      // ids === [ "#checkbox1", "#checkbox2", …]
      const ids = elements.reduce((acc, element) => {
        // Add hash symbol
        acc.push(`#${element.id}`);

        return acc;
      }, []);

      // Creates a new multiple select from list of IDs
      return $w(ids.join(',')); // $w("#checkbox1,#checkbox2,…")
    },
  };
};
```

I use the [array method `arr.reduce()`](https://javascript.info/array-methods#reduce-reduceright) because we need to filter and transform array items.

For the filtering, we will use the helper function `hasParent()`. In this function, we return `true` if the element has a parent element with the needed ID or `false` if all parents don't have this ID.

```js
const hasParent = (element, parentId) => {
  while (element) {
    // On each iteration, we get a next parent element
    element = element.parent;

    if (element?.id === parentId) {
      return true;
    }
  }

  return false;
};
```

Add the condition to filter.

```js
export const findIn = (selector) => {
  // Removes a hash symbol at the selector start
  // Because the `element.id` doesn't have a hash (#) symbol in value.
  const parentId = selector.replace(/^#/, '');

  return {
    all(type) {
      /** @type {any} */
      const elements = $w(type);

      const ids = elements.reduce((acc, element) => {
        // Add condition:
        // if the element has a parent node with the needed ID
        // then add it to the return result.
        if (hasParent(element, parentId)) {
          acc.push(`#${element.id}`);
        }

        return acc;
      }, []);

      return $w(ids.join(','));
    },
  };
};
```

We created a child selector. Let's see an example of using and live demo

**An example of use.** Child selector for two groups of checkboxes:

```js
$w.onReady(() => {
  $w('#checkboxAllYellow').onChange((event) => {
    findIn('#boxYellow').all('Checkbox').checked = event.target.checked;
  });

  $w('#checkboxAllBlue').onChange((event) => {
    findIn('#boxBlue').all('Checkbox').checked = event.target.checked;
  });
});
```

<figure>
  <figcaption>
    <strong>Live Demo:</strong>
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/child-selector"
    title="Live Demo - child query selector for Velo elements"
    height="480"
    scrolling="no"
  ></iframe>
</figure>

## JSDoc

Finally, I want to add the [JSDoc](https://jsdoc.app/) to provide autocomplete and type checking. For this, we have a built-in types annotation in Velo editor.

- `WixElementSelector` - it's a [union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) of all IDs on the current site page. Unfortunately, we can't use this union on the public files. Only on the page files.
- `TypeNameToSdkType` - it's an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) for all elements type.

**Add types annotation:**

```js
/**
 * @param {WixElementSelector} selector
 */
export const findIn = (selector) => {
  const parentId = selector.replace(/^#/, '');

  return {
    /**
     * @template {keyof TypeNameToSdkType} T
     * @param {T} type
     * @returns {TypeNameToSdkType[T]}
     */
    all(type) {…},
  };
};
```

Below is a video demonstrating the benefits of using JSDoc annotations.

<figure>
  <figcaption>
    <strong>JSDoc autocomplete and type checking</strong>
  </figcaption>
  <video
    src="/assets/videos/jsdoc-autocomplete.mp4"
    type="video/mp4"
    preload="metadata"
    width="1920"
    height="790"
    controls
  />
</figure>

## Code Snippet

Here is a full snippet of the child query selector function with JSDoc types.

<details>
  <summary>
    <strong>HOME Page (code)</strong>
  </summary>

```js
/**
 * @param {$w.Node} element
 * @param {string} parentId
 * @returns {boolean}
 */
const hasParent = (element, parentId) => {
  while (element) {
    element = element.parent;

    if (element?.id === parentId) {
      return true;
    }
  }

  return false;
};

/**
 * @param {WixElementSelector} selector
 */
export const findIn = (selector) => {
  const parentId = selector.replace(/^#/, '');

  return {
    /**
     * @template {keyof TypeNameToSdkType} T
     * @param {T} type
     * @returns {TypeNameToSdkType[T]}
     */
    all(type) {
      /** @type {any} */
      const elements = $w(type);

      const ids = elements.reduce((acc, element) => {
        if (hasParent(element, parentId)) {
          acc.push(`#${element.id}`);
        }

        return acc;
      }, []);

      return $w(ids.join(','));
    },
  };
};

$w.onReady(() => {
  $w('#checkboxAllYellow').onChange((event) => {
    findIn('#boxYellow').all('Checkbox').checked = event.target.checked;
  });

  $w('#checkboxAllBlue').onChange((event) => {
    findIn('#boxBlue').all('Checkbox').checked = event.target.checked;
  });
});
```
</details>

If you have any questions, feel free to ask me on my <a href="https://twitter.com/_shoonia" rel="me">Twitter</a>. Cheers! 👨‍💻 👩‍💻

## Posts

- [Promise Queue](/promise-queue)
- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers)
- [Imitating hover event on repeater container](/corvid-imitate-hover-event)
- [Short links to create a new Wix / Editor X site editor](/wix-velo-editorx-short-links)
