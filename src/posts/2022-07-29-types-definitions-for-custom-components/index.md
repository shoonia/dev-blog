---
permalink: '/types-definitions-for-custom-components/'
date: '2022-07-29T12:00:00.000Z'
modified: '2022-07-29T12:00:00.000Z'
lang: 'en'
title: 'Velo By Wix: Types definitions for Custom Components'
description: 'How to add support type checking for DOM elements using TypeScript Triple-Slash Directives in Velo?'
image: '/assets/images/velo.png'
---

# Velo By Wix: Types definitions for Custom Components

*How to add support type checking for DOM elements using TypeScript Triple-Slash Directives in Velo?*

Velo editor has the built-in [TypeScript](https://www.typescriptlang.org/) compiler for type checking and code auto-completion.

- [Type safety your code with JSDoc](/type-safety-your-code-with-jsdoc/)
- [Global type definitions](/global-type-definitions-in-velo/)

<figure>
  <img
    src="/assets/images/auto-completion.jpg"
    alt="code completion in velo editor"
    loading="lazy"
  />
  <figcaption>
    <em>Example of autocomplete in Velo</em>
  <figcaption>
</figure>

## DOM types support

<figure>
  <figcaption>
    <cite>The TypeScript Handbook:</cite>
    <a href="https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html">Triple-Slash Directives</a>
  </figcaption>
  <blockquote cite="https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html">
    Triple-slash directives are single-line comments containing a single XML tag. The contents of the comment are used as compiler directives.
  </blockquote>
</figure>


```ts
/// <reference lib="dom" />
```
