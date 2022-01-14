---
permalink: '/html-template-in-corvid.html'
date: '2019-11-03T12:00:00.000Z'
modified: '2021-01-04T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Using HTML template to the better performance'
description: "The $w.Repeater most popular element on Wix sites and it the first killer of performance. In this article, we look at how we can do the repeater faster."
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/fd206f_3f9056525647471085f98284dde0d3dc~mv2.jpg'
---

# Velo by Wix: Using HTML template to the better performance

*The `$w.Repeater` most popular element on Wix sites and it the first killer of performance. In this article, we look at how we can do the repeater faster.*

<img
  src="https://static.wixstatic.com/media/e3b156_68a5d808d23c4167bbda3f55e72726e9~mv2.jpg"
  alt="fragment of Wix promo video"
  width="800"
  height="361"
/>

I have been working with the Velo platform for more than a year. The `$w.Repeater` element most popular in our projects, it's a great element it has very flexibility potential. We really use it very often.

But repeater has a problem with performance. The more we use elements in repeater containers, the slower it works. For example user cards with contact info:

```js
$w("#repeater1").onItemReady( ($item, itemData, index) => {
  $item("#image1").src = itemData.avatar;
  $item("#firstName").text = itemData.firstName;
  $item("#lastName").text = itemData.lastName;
  $item("#company").text = itemData.compony;
  $item("#phone").text = itemData.phone;
  $item("#email").text = itemData.email;
});
```

We need to control the number of elements and trying to use fewer elements that we can. For this, we consider using templates. This way has a restriction, we can't use it with the [database collections UI](https://support.wix.com/en/article/velo-working-with-wix-data) we can use it only with code.

## Install Lodash

We would be using the function `_.template()` from library [Lodash](https://lodash.com/docs/4.17.15#template). The first we need to install Lodash with [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages).

<img
  src="https://static.wixstatic.com/media/e3b156_fbb231d5ad4c4ed7a2abcd8c9e815e72~mv2.png"
  alt="Lodash installation with Velo Package Manager"
  width="948"
  height="214"
  loading="lazy"
/>

After installation, we can use Lodash just import to your code.

```js
import _ from "lodash";
```

## Text templates

Now we look at a simple example to understand how to work template.

```js
// #1 install and import
import _ from "lodash";

// #2 Use custom template delimiters.
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

// #3 Pattern string with two keys
const pattern = "Hello, {{firstName}} {{lastName}}!";

// #4 Create a compiled template.
const compiled = _.template(pattern);

$w.onReady(function () {

  // #5 result: "Hello, John Doe!"
  $w("#text1").text = compiled({
    firstName: "John",
    lastName: "Doe"
  });

});
```

**How it works:**

1. Importing Lodash library. The first you have to install the library from [Package Manager](https://support.wix.com/en/article/velo-working-with-npm-packages)
2. Setting the custom template delimiters as `{{key}}` . Lodash uses delimiters `<%=key%>` by default. [more](https://lodash.com/docs/4.17.15#template)
3. Pattern string with two keys `{{firstName}}` and `{{lastName}}`.
4. Creating a compiled template, it returns a function `compiled()` which will be passed an object with properties. `{ firstName: "John", lastName: "Doe" }`.
5. The `compiled()` function gets an object and returns the string with replaced keys to the object properties value. Result `"Hello, John Doe!"`.

## HTML templates

We can get a text element's HTML content by `.html` property. [$w.Text](https://www.wix.com/velo/reference/$w/text/html)

```js
const value = $w("#textTemplate").html; // "<b>Bold Text</b>"
```

This means we can get HTML of the text elements with all their styles! Cool, why don't we use it as a template…

<img
  src="https://static.wixstatic.com/media/e3b156_f1ce214c51584716a67de08242b459c4~mv2.png"
  alt="Wix Editor - template of text element"
  width="680"
  height="291"
  loading="lazy"
/>

We created a needed text template with markup, styles, and keys where we want to pass params. Then we hide the text element in the properties panel "Hidden on load".

In the repeater container, we keep only two elements `#image1` and `#text1`.

<img
  src="https://static.wixstatic.com/media/e3b156_702b764780a947cbb00f7d179e4cf58e~mv2.png"
  alt="Repeater container has only two elements"
  width="680"
  height="330"
  loading="lazy"
/>

There's only we need to change HTML of `#text1` elements in repeater containers to HTML of the `#textTemplate` pattern element.

```js
import _ from "lodash";

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

$w.onReady(function () {
    // Create a compiled template
    const compiled = _.template( $w("#textTemplate").html );

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
        $item("#image1").src = itemData.avatar;
        $item("#text1").html = compiled(itemData); // use template
    });

    // set repeater data
    $w("#repeater1").data = [ /* here are our users */ ];
});
```

It works faster now because we have only two elements in repeater one image and one text element. [DEMO](https://shoonia.wixsite.com/blog/html-template-in-corvid)

## Resources

- [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
- [Lodash: _.tempalate();](https://lodash.com/docs/4.17.15#template)
- [Velo: get a text element's HTML content](https://www.wix.com/velo/reference/$w/text/html)
- [DEMO](https://shoonia.wixsite.com/blog/html-template-in-corvid)
- [This article on medium.com](https://medium.com/@shoonia/corvid-by-wix-using-html-template-to-the-better-performance-27ec5a18042e)

## Posts

- [A tiny event-based state manager Storeon for Velo](/corvid-storeon)
- [Imitating hover event on repeater container](/corvid-imitate-hover-event)
- [Event handling of Repeater Item](/event-handling-of-repeater-item)
