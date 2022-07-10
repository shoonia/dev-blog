---
permalink: '/global-type-definitions-in-velo/'
date: '2022-07-08T12:00:00.000Z'
modified: '2022-07-08T12:00:00.000Z'
lang: 'en'
title: 'Velo By Wix: Global type definitions'
description: 'How to add a global JSDoc types definition in Velo'
image: '/assets/images/velo.png'
head: '
<link rel="stylesheet" href="/assets/styles/file-tree.css?v=2"/>
'
---

# Velo By Wix: Global type definitions

*How to add a global JSDoc types definition in Velo*

![use jsdoc](/assets/images/use-jsdoc.svg)

In one of my previous posts, [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/), we considered how to use the type definitions and [JSDoc](https://jsdoc.app/) annotations in Velo. In this post, I want to show how we can use global types in Velo editor.

## Global type definitions file

In Velo, we also are able to describe global types annotations. The global types will be available on any JS/JSW files on the editor. It could be helpful if you use the same entity in separate files.

To declare global types in Velo, we should create a `*.d.js` file in the public section. For example, I always use `types.d.js` file. The end of the file with `.d.js` is required.

<div class="_filetree" role="presentation" aria-label="velo sidebar">
  <div class="_filetree_tab _filetree_row">
    <strong>Public & Backend</strong>
  </div>
  <div class="_filetree_title _filetree_row">
    <img src="/assets/images/i/open.svg" alt=""/>
    Public
  </div>
  <div class="_filetree_tab _filetree_row">
    <img src="/assets/images/i/js.svg" alt=""/>
    types.d.js
  </div>
</div>

Use tag `@typedef`, we describe types.

<aside>

**Syntax**

`@typedef {<TYPE>} <NAMEPATH>`

**Overview**

The `@typedef` tag is useful for documenting custom types, particularly if you wish to refer to them repeatedly. These types can then be used within other tags expecting a type, such as `@type` or `@param`.
</aside>

We can use JSDoc syntax or TypeScript syntax inside JSDoc.

## Use case examples

For example, we want to send a user data object to the [lightbox](https://www.wix.com/velo/reference/wix-window/lightbox) when it opens. And use this data in the lightbox. Using global typedef, we can share types info across pages and lightbox pages.

My user object will have three properties:

**User Data Object**

```json
{
  "memeberId": "3bbf4e2c-528d-4b90-a882-cd80641687fc",
  "nickname": "Bob",
  "email": "bob@email.ua"
}
```

Let's start with types annotation. I prefer to use a [TypeScript object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) syntax for object definitions. It's similar to CSS syntax, where we describe a key name and types inside curly braces separate with semicolons `@typedef { { keyName: type; … } } TypeName`

**public/types.d.js**

```js
// Filename: public/types.d.js

/**
 * @typedef {{
 *  memeberId: string;
 *  nickname: string;
 *  email: string;
 * }} TUser
 */
```

Now, the `TUser` type is available globally on the project. In the **Page Code Tab**, we apply the `TUser` type for creating a user object.

**Page Code Tab**

```js
import wixData from 'wix-data';
import { openLightbox } from 'wix-window';
import { currentMember } from 'wix-members';

$w.onReady(function () {
  $w('#button1').onClick(async () => {
    const memeber = await currentMember.getMember();

    /** @type {TUser} */
    const user = {
      memeberId: memeber._id,
      nickname: memeber.profile.nickname,
      email: memeber.loginEmail,
    };

    openLightbox('Confirm-Lightbox', user);
  });
});
```

You can ensure that the editor starts to work with autocomplete and code analysis if we use types.

Also, we should use the `TUser` type for annotation of lightbox context data. It starts to work with autocomplete and code analysis too.

**Lightbox Page Code Tab**

```js
import { lightbox } from 'wix-window';

$w.onReady(function () {
  /** @type {TUser} */
  const user = lightbox.getContext();

  $w('#text1').text = user.nickname;
  $w('#text2').text = user.email;
});
```

Typed code provides a good developer experience. It's helpful for automatization your development process. You don't need to keep in mind the data structure. And types analysis improves your code safety.

## Resources

- [Official documentation for JSDoc 3](https://jsdoc.app/)
- [TypeScript: Documentation - JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [JSDoc Cheatsheet and Type Safety Tricks](https://docs.joshuatz.com/cheatsheets/js/jsdoc/)

## Posts

- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Download your Velo code files to your computer](/velo-filesystem-chrome-extension/)
- [Repeated item event handlers v2.0](/repeated-item-event-handlers-v2/)
- [Query selector for child elements](/velo-query-selector-for-child-elements/)
