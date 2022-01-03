---
publish: true
path: '/velo-child-elements-selector'
template: 'default'
date: '2022-01-01T12:00:00.000Z'
modified: '2022-01-01T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Child elements selector'
description: 'Get children elements into specific parent node. In this post, we take a look deeper at `$w()` selectors and trying to filter children element for specific parent node.'
author: 'Alexander Zaytsev'
image: ''
---

# Velo by Wix: Child elements selector

*Get children elements into specific parent node. In this post, we take a look deeper at `$w()` selectors and trying to filter children element for specific parent node.*

<img
  src="/images/december1994.jpg"
  width="1024"
  height="421"
  alt="Concept ART by television serial - Tales from the loop"
  crossorigin="anonymous"
/>

Let's suppose we have a few containers with checkboxes in each of them. We don't know how many checkboxes will be in each container at the final design.

Each container has a "select all" named checkbox that allows us to check on/off all checkboxes into a current container.

We want to provide a good abstract solution for avoiding hard coding of elements' ID. And ensure scaling for any count of the elements in the future.

<figure>
  <figcaption>
    <strong>Example of two groups with checkboxes</strong>
  </figcaption>
  <img
    src="/images/yellow-blue.jpg"
    width="1500"
    height="600"
    alt="Wix Editor with two box groups"
    loading="lazy"
    decoding="async"
    crossorigin="anonymous"
    style="border:1px solid rgb(112 128 144 / 40%);border-radius:8px"
  />
</figure>

In general, we need to find a way to query select all child elements into a specific parent node. Using CSS selector syntax we can describe our selector as:

<figure>
  <figcaption>

  **Pseudocode via CSS syntax for describing a child selector behavior**
  </figcaption>

  ```css
  /* Gets all "$w.Chackbox" element into "#boxYellow" */
  #boxYellow $w.Checkbox {

  }
  ```
</figure>

## CSS selector work from right to left

If you are familiar with CSS selectors, you can see that they work from right to left.

Let's look at an example, here we want to apply styles for all `<span>` child elements into parent nodes that have `.box-content` class:

```html
<style>
/* Find all <span> element in ".box-content" elements */
.box-content span {
  font-weight: bold;
  color: seagreen;
}
</style>
<!--
  Browser matches the selectors from right to left.
  The first, browser find all <span> element on the page
  then browser filter only <span> elements
  that have a parent element with the class="box-content"
-->
<div class="box-content">
  CSS selector work from <span>right</span> to <span>left</span>
</div>
```

**Reslut:**

<aside>
  <style>
  .box-content span {
    font-weight: bold;
    color: seagreen;
  }
  </style>
  <div class="box-content">
    CSS selector work from <span>right</span> to <span>left</span>
  </div>
</aside>

Under the hood, all modern browsers use the "from right to left" algorithm to select child elements.

- More: [Why do browsers match CSS selectors from right to left?](https://stackoverflow.com/questions/5797014/why-do-browsers-match-css-selectors-from-right-to-left/5813672#5813672)

## Child selector for Velo

I propose using the "from right to left" algorithm for our task. Especially we have all needed API for this.

In one of my previous posts, we solved a very similar issue. There we have created a tiny library for [getting a parent Repeater from repeated items](/the-utils-for-repeated-item-scope-event-handlers).

### Select elements by type

<figure>
  <figcaption>

  In Velo, we have an API for [getting all elements on the page by type](https://www.wix.com/velo/reference/$w/$w#:~:text=To%20select%20by%20type%2C%20pass%20a%20selector%20string%20with%20the%20name%20of%20the%20type%20without%20the%20preceding%20%23%20(e.g.%20%22Button%22).%20The%20function%20returns%20an%20array%20of%20the%20selected%20element%20objects.%20An%20array%20is%20returned%20even%20if%20one%20or%20no%20elements%20are%20selected).
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/$w">

  To select by type, pass a selector string with the name of the type without the preceding `#` (e.g. "Button"). The function returns an array of the selected element objects. An array is returned even if one or no elements are selected.
  </blockquote>
</figure>

For example, we can get a list of elements and manipulate their methods.

<figure>

```js
// Gets all buttons on the page
const buttonElements = $w('Checkbox');
// Disable all buttons
buttonElements.disable();

// Gets all text elements on the page
const textElemets = $w('Text');
// Rewrite all text elements on the page
textElemets.text = 'Hello';
```
  <figcaption>
    Each editor element has its own type.
  </figcaption>
</figure>

In Velo, ref documentation describes a small piece of [the possible editor elements type](https://www.wix.com/velo/reference/$w/element/type).

Fortunately, all type definitions for Velo APIs are available on the open source [GitHub repository](https://github.com/wix-incubator/corvid-types) and [npm package](https://www.npmjs.com/package/corvid-types).

<details>
  <summary>
    <strong>Full list of the possible Wix element types</strong>
  </summary>
  <aside>

  Source: [Type definitions for Velo by Wix](https://npm.runkit.com/corvid-types/types/pages/$w.d.ts)
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

```js
// Gets a checkbox's parent element
const parentElement = $w('#checkboxAllYellow').parent;

// Gets the parent element's ID
const parentId = parentElement.id; // "boxYellow"
```

```js
// Find in #boxYellow all child elements with type `$w.Checkbox`
findIn('#boxYellow').all('Checkbox');
```

<aside>

  **Pay Attention**

  The `id` property return element ID without preceding hash (`#`) symbol

  ```js
  console.log($w('#boxYellow').id); // "boxYellow"
  ```
</aside>


<figure>
  <figcaption>

  Check how it works on **Live Demo**
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/child-selector"
    width="100%"
    height="390"
    loading="lazy"
    crossorigin="anonymous"
    title="Live Demo of Child selector"
    scrolling="no"
    style="overflow:hidden"
  ></iframe>
</figure>

## JSDoc



## Code Snippet

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
