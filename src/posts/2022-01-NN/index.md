---
permalink: '/xyz/'
date: '2022-01-19T12:00:00.000Z'
modified: '2022-01-19T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Utils for repeated item event handlers v2.0'
description: "It's my third post about event handling in repeated items. I show you a way that always has been in the documentation. I'm surprised why I didn't notice it before"
author: 'Alexander Zaytsev'
image: '/assets/images/i300x300.jpg'
---

<script type="cow/moo">
\|/             \|/

            (__)
   *`\------(oo)  hello
      ||    (__)
      ||w--||
      ^^   ^^
\|/             \|/
</script>

# Velo by Wix: Utils for repeated item event handlers v2.0

*It's my third post about event handling in repeated items. I show you a way that always has been in the documentation. I'm surprised why I didn't notice it before*

![concept art by television serial - tales from the loop](/assets/images/a.jpg)

Yes, and again the event handling in Repeater. For me, the event handling of the repeated items was maybe the first confusion in my Velo projects.

I wrote two articles about it, you can find them in this blog:

1. [Event handling of Repeater Item](/event-handling-of-repeater-item/) - here we considered how to handle events in the repeated items and we created a primitive helper function.
2. [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/) - here we created a more smart code snippet that can automatically receive parent Repeater item data from the event.

## Method forItems()

The Repeater has the [`forItems()`](https://www.wix.com/velo/reference/$w/repeater/foritems) method that allows us to run specific repeated items with the given list of IDs. I have never use it before. Previously, if I wanted to rerender a Repeater I used the [`forEachItem()`](https://www.wix.com/velo/reference/$w/repeater/foreachitem) method.

<figure>
  <figcaption>
    <cite>Velo API Reference</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/repeater/foritems">
    Use the <code>forItems()</code> function to run a function on a specified list of repeated items. You can use the callback function to update or pull information from the specified repeated items
  </blockquote>
</figure>

In the documentation, we can see the next example.

<figure>
  <figcaption>
    <strong>Velo: Update data in some of a repeater's repeated items</strong>
  </figcaption>

  ```js
  $w('#myRepeater').forItems(['item1', 'item4'], ($item, itemData, index) => {
    $item('#repeatedImage').src = itemData.img;
    $item('#repeatedText').text = itemData.description;
  });
  ```
</figure>

<figure>
  <figcaption>

   **Velo:** [Get the context of the event](https://www.wix.com/velo/reference/$w/event/context)
  </figcaption>

  ```js
  $w('#repeatedButton').onClick((event) => {
    // ID of the repeater item where the event was fired from.
    const itemId = event.context.itemId;
  });
  ```
</figure>

<figure>
  <figcaption>
    <strong>Velo: Retrieve Repeater Item Data When Clicked</strong>
  </figcaption>

  ```js
  $w.onReady(() => {
    $w('#repeatedButton').onClick((event) => {
      $w('#myRepeater').forItems([event.context.itemId], ($item, itemData, index) => {
        // Update a target repeater item
        $item('#repeatedText').text = itemData.title;
      });
    });
  });
  ```
</figure>

## Resources

- [GitHub: `repeater-scope`](https://github.com/shoonia/repeater-scope)
- [Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)
- [Velo: Understanding the Scope of Selector Functions](https://support.wix.com/en/article/velo-understanding-the-scope-of-selector-functions)
- [Retrieve Repeater Item Data When Clicked](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked)

## Posts

- [Query selector for child elements](/velo-query-selector-for-child-elements/)
- [Promise Queue](/promise-queue/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/)
