---
date: '2022-07-17T12:00:00.000Z'
modified: '2022-07-17T12:00:00.000Z'
lang: 'en'
title: 'Velo By Wix: Reload a page'
description: 'How to reload a page using Velo?'
image: '/assets/images/velo.png'
---

# Reload a page

How to reload a page using Velo?

```js
import { to, url } from 'wix-location';

$w.onReady(function () {
  $w('#button1').onClick(() => {
    to(url);
  });
});
```

- [wix-location](https://www.wix.com/velo/reference/wix-location/introduction)
