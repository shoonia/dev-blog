---
permalink: '/repeated-item-event-handlers-v2/'
date: '2022-01-21T12:00:00.000Z'
modified: '2024-01-11T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Repeated item event handlers v2.0'
description: "Here's my third post about event handling in repeated items. I'll show you a method that has always been mentioned in the documentation. I'm surprised that I hadn't noticed it earlier."
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

*Here's my third post about event handling in repeated items. I'll show you a method that has always been mentioned in the documentation. I'm surprised that I hadn't noticed it earlier.*

![concept art by television serial - tales from the loop](/assets/images/a.jpg)

Yes, and the event handling in Repeater is something that I found to be confusing in my Velo projects initially.

I have written two articles on this topic, which you can find on this blog.

1. [Event handling of Repeater Item](/event-handling-of-repeater-item/) - in this section, we will explore how to efficiently manage events for repeated items. To simplify the process, we have developed a practical helper function.
2. [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/) - Here, we have developed an improved code snippet that intelligently retrieves parent Repeater item data from the event automatically.

The main idea of these two articles is that it is generally not recommended to nest an event handler inside any Repeater loop. Doing so can cause issues where the callback function is triggered multiple times by a single event.

The Velo documentation uses the following method to handle events using [event context](https://www.wix.com/velo/reference/$w/event/context).

<figure>
  <figcaption>

  **Velo:** [Understanding the Scope of Selector Functions](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/repeaters/understanding-the-scope-of-selector-functions#repeated-item-scope)
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

In most cases, the existing information is sufficient. However, if we require more specific details such as the item's data object or the index of the item that was triggered, the documentation offers the following way:

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
</figure>

It does not look bad. But we want to have a better 😊

## Method forItems()

The Repeater has the [`forItems()`](https://www.wix.com/velo/reference/$w/repeater/foritems) method that allows us to run specific repeated items with the given list of IDs. I have never used it before. Previously, if I wanted to rerender some Repeater items then I just used the [`forEachItem()`](https://www.wix.com/velo/reference/$w/repeater/foreachitem) method. `forItems()` allows us to run the callback function for specific items, not all.

<figure>
  <figcaption>
    <cite>Velo API Reference:</cite>
  </figcaption>
  <blockquote cite="https://www.wix.com/velo/reference/$w/repeater/foritems">
    Use the <code>forItems()</code> function to run a function on a specified list of repeated items. You can use the callback function to update or retrieve information from the specified repeated items.
  </blockquote>
</figure>

In the documentation, there is an example code that updates the data of two items based on their IDs.

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

Wow, this is a fantastic opportunity! It's always been right there in the documentation. I can't believe I didn't notice it earlier.

For example, we can solve our current issue with receiving item data.

<figure>
  <figcaption>
    <strong>Velo: Retrieve item scope selector function, item data, and index</strong>
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

Magic. For me, it's a very expressive code. And it's a good alternative to all known methods that I used before, like:[repeater-scope npm package](https://github.com/shoonia/repeater-scope).

## Resources

- [Velo: Understanding the Scope of Selector Functions](https://dev.wix.com/docs/develop-websites/articles/wix-editor-elements/repeaters/understanding-the-scope-of-selector-functions)
- [Retrieve Repeater Item Data When Clicked](https://www.wix.com/velo/reference/$w/repeater/introduction#$w_repeater_introduction_retrieve-repeater-item-data-when-clicked)
- [Get the element context in which an event was fired](https://www.wix.com/velo/reference/$w/event/context)

## Posts

- [Query selector for child elements](/velo-query-selector-for-child-elements/)
- [Promise Queue](/promise-queue/)
- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/)
