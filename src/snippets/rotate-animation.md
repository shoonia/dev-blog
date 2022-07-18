---
date: '2022-07-18T12:00:00.000Z'
modified: '2022-07-18T12:00:00.000Z'
lang: 'en'
title: 'Velo By Wix: Rotate Animation'
description: 'Rotate Animation in Velo'
image: '/assets/images/velo.png'
---

# Rotate Animation

Rotate animation in Velo

```js
import { timeline } from 'wix-animations';

$w.onReady(function () {
  const $image = $w('#image1');

  timeline({ repeat: -1 }).add($image, {
    duration: 2000,
    rotate: 360,
    rotateDirection: 'cw',
    easing: 'easeLinear'
  }).play();
});
```

<figure>
 <figcaption>
    <strong>Live Demo</strong>
  </figcaption>
  <iframe
    src="https://shoonia.wixsite.com/blog/rotate-animation"
    title="Wix Site"
    height="300"
  ></iframe>
</figure>

- [wix-animations](https://www.wix.com/velo/reference/wix-animations)
