---
publish: false
path: '/'
template: 'default'
date: '2019-xx-xxT12:00:00.000Z'
lang: 'ua'
title: ''
description: ''
author: ''
image: ''
---

# Створюємо API що повертає QR Code зображення

## Привіт Світ!

[Порожнiй шаблон](https://editor.wix.com/html/editor/web/renderer/new?siteId=cbf36d3a-49d0-41c2-9482-1bb58d5fdda3&metaSiteId=a573279f-ae6f-46d1-8556-7c93ae9b2c84)

## wix-http-functions

```js
import { response } from "wix-http-functions";

export function get_qrcode(request) {
  const text = "Hello";

  return response({
    status: 200,
    body: text,
  });
}
```
```
https://<USER_NAME>.wixsite.com/<SITE_NAME>/_functions/qrcode
```

`?text=Hello`

`request.query.text`

`decodeURIComponent(request.query.text);`

```js
import { response } from "wix-http-functions";

export function get_qrcode(request) {
  const text = decodeURIComponent(request.query.text);

  return response({
    status: 200,
    body: text,
  });
}
```

```
https://<USER_NAME>.wixsite.com/<SITE_NAME>/_functions/qrcode?text=Hello
```

[node-qrcode](https://github.com/soldair/node-qrcode)

## QR Code

```js
import QRCode  from "qrcode";

const text = "Hello";

QRCode.toDataURL(text, (error, url) => {
  console.log(url);
});
```

```js
function getQRCode(text) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, (error, url) => {
      if (error) return reject(error);
      return resolve(url);
    });
  });
}
```

```js
import { response } from "wix-http-functions";
import QRCode  from "qrcode";

function getDataURL(text) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, (error, url) => {
      if (error) return reject(error);
      return resolve(url);
    });
  });
}

export async function get_qrcode(request) {
  const text = decodeURIComponent(request.query.text);
  const dataURL = await getDataURL(text);

  return response({
    status: 200,
    body: dataURL,
  });
}
```
```
data:image/png;base64,iVBORw0< ... >RK5CYII=
```

```html
<img src="data:image/png;base64,iVBORw0< ... >RK5CYII=">
```

```
data:[<mediatype>][;base64],<data>
```

```js
const base64 = dataURL.slice(22);
```

```js
Buffer.from(base64, "base64");
```

```json
{
  "Content-Type": "image/png"
}
```

`/* eslint-env node */`

```js
import { response } from "wix-http-functions";
import QRCode  from "qrcode";

function getDataURL(text) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, (error, url) => {
      if (error) return reject(error);
      return resolve(url);
    });
  });
}

export async function get_qrcode(request) {
  const text = decodeURIComponent(request.query.text);
  const dataURL = await getDataURL(text);
  const base64 = url.slice(22);

  return response({
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
    body: Buffer.from(base64, "base64"),
  });
}
```
