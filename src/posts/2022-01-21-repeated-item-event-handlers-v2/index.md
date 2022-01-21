---
permalink: '/repeated-item-event-handlers-v2/'
date: '2022-01-21T12:00:00.000Z'
modified: '2022-01-21T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Repeated item event handlers v2.0'
description: "It's my third post about event handling in repeated items. I show you a way that always has been in the documentation. I'm surprised why I hadn't noticed that before?"
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

# Velo by Wix: Repeated item event handlers v2.0

*It's my third post about event handling in repeated items. I show you a way that always has been in the documentation. I'm surprised why I hadn't noticed that before?*

![concept art by television serial - tales from the loop](/assets/images/a.jpg)

Yes, and again the event handling in Repeater. For me, the event handling of the repeated items was maybe the first confusion in my Velo projects.

I wrote two articles about it, you can find them in this blog:

1. [Event handling of Repeater Item](/event-handling-of-repeater-item/) - here we considered how to handle events in the repeated items and we created a primitive helper function.
2. [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/) - here we created a more smart code snippet that can automatically receive parent Repeater item data from the event.

The main idea of these two articles, we shouldn't nest an event handler in any Repeater loop. It could be a reason when a callback function runs a few times by one event.

The Velo documentation is supposed to use the next way for handling events using [event context](https://www.wix.com/velo/reference/$w/event/context).

<figure>
  <figcaption>

  **Velo:** [Understanding the Scope of Selector Functions](https://support.wix.com/en/article/velo-understanding-the-scope-of-selector-functions#repeated-item-scope)
  </figcaption>

  ```js
  $w.onReady(function () {
    $w('#myRepeatedImage').onClick((event) => {
      const $item = $w.at(event.context);

      $item('#myRepeatedText').text = 'Selected';
    });
  });
  ```
</figure>

In most cases, it's enough. But, if we need to receive an item data object or index of the fired item, the documentation provides something like this:

<figure>
  <figcaption>

  **Velo API Reference:** [Retrieve Repeater item data when clicked](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked)
  </figcaption>

  ```js
  $w.onReady(function () {
    $w('#repeatedContainer').onClick((event) => {
      const $item = $w.at(event.context);
      const data = $w('#myRepeater').data;

      const clickedItemData = data.find((i) => i._id === event.context.itemId);
      const clickedItemIndex = data.findIndex((i) => i._id === event.context.itemId);

      console.log('itemData', clickedItemData);
      console.log('index', clickedItemIndex);
    });
  });
  ```
<figure>

It does not look bad. But we want to have a better 😊

## Method forItems()

The Repeater has the [`forItems()`](https://www.wix.com/velo/reference/$w/repeater/foritems) method that allows us to run specific repeated items with the given list of IDs. I have never used it before. Previously, if I wanted to rerender some Repeater items then I just used the [`forEachItem()`](https://www.wix.com/velo/reference/$w/repeater/foreachitem) method. `forItems()` allows us to run the callback function for specific items, not all.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/repeater/foritems">
    Use the <code>forItems()</code> function to run a function on a specified list of repeated items. You can use the callback function to update or pull information from the specified repeated items
  </blockquote>
</figure>

In the documentation, we can see the next example, which runs changes for two items by IDs.

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

Really, it's a very cool opportunity. It's always has been in the documentation. Why I hadn't noticed that before?

For example, we can solve our current issue with receiving item data.

<figure>
  <figcaption>
    <strong>Velo: Retrieve items scope selector function, item data, and index</strong>
  </figcaption>

  ```js
  $w.onReady(function () {
    $w('#repeatedButton').onClick((event) => {
      // Run callback for item ID from event context
      $w('#myRepeater').forItems([event.context.itemId], ($item, itemData, index) => {
        $item('#myRepeatedText').text = 'Selected';

        console.log('itemData', itemData);
        console.log('index', index);
      });
    });
  });
  ```
</figure>

Magic. For me, it's a very expressive code. And it's a good alternative to all known methods that I use before, like: [repeater-scope npm package](https://github.com/shoonia/repeater-scope).

## Resources

- [Velo: Understanding the Scope of Selector Functions](https://support.wix.com/en/article/velo-understanding-the-scope-of-selector-functions)
- [Retrieve Repeater Item Data When Clicked](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked)
- [Get the element context in which an event was fired](https://www.wix.com/velo/reference/$w/event/context)

## Posts

- [Query selector for child elements](/velo-query-selector-for-child-elements/)
- [Promise Queue](/promise-queue/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/)
