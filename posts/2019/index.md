---
publish: false
path: '/qr-code-api-generator'
template: 'default'
date: '2019-xx-xxT12:00:00.000Z'
lang: 'ua'
title: 'Створюємо API для генерації QR Code зображень'
description: ''
author: 'Олександр Зайцев'
image: ''
---

# Створюємо API для генерації QR Code зображень

Привіт Світ!

Саме API ми розгонимо на безкоштовному сайті Wix.

Для початку нам необхідно зареєструватися на сайті [wix.com](https://uk.wix.com) для цього ви можете використати свій обліковий запис на Facebook або Google, потім нам потрібно створити сайт, щоб ви не витрачали час перейдіть за цим посиланням [Порожнiй шаблон](https://editor.wix.com/html/editor/web/renderer/new?siteId=cbf36d3a-49d0-41c2-9482-1bb58d5fdda3&metaSiteId=a573279f-ae6f-46d1-8556-7c93ae9b2c84). За цим посиланням ми потрапляємо прямісінько в редактор нового сайту. Після цього нам потрібно активувати Corvid. Corvid це розширення можливостей сайтів Wix, що дає нам змогу до написання скриптів як на frontend так і backend частині сайту. У верхній частині сайту шукаємо пункт меню "Dev Mode", обираємо цей пункт і у розгорнутому підменю в самому низі тиснемо на кнопку "Увімкнути Corvid"  (Turn on Dev Mode)

Після цього у вас зліва повинна з'явитися файлова структура сайту (Site Structure):

- Pages
- Public
- Backend
- node_modules
- База даних
- Мої додатки

Зараз нас цікавлять тільки два з них це Backend та node_modules. Почнемо з node_modules, наводимо на цю теку і зліва з'являється іконка зубчатки, тиснемо на неї та обираємо "Install a New Pakage". Перед нами відкриється "Менеджер пакетів" (Package Manager). В полі пошуку "Пошук по пакетах" (Search packages), вводимо "qrcode", саме за допомогою цієї бібліотеки ми будемо генерувати QR Code, обираємо "Встановити" (Install).

## wix-http-functions

Тепер перейдемо до теки Backend. В цій теці нам потрібно створити javascript файл "Hовий файл .js" (New .js File) з назвою 'http-functions.js'. Ми повинні створити файл саме с такою назвою, це обов'язково. Після створення файлу в ньому ми можемо побачити код с прикладом, ми не будемо розглядати цей приклад і створимо послідовно все з початку. Видаляємо зразок та починаємо.

```js
 export function <prefix>_<functionName>(request) { }
```

<prefix> is one of get, post, put, delete, options, 

or use and <functionName>

```js
export function get_qrcode(request) {
  // TODO: ...
}
```

`import { response } from "wix-http-functions";`


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
  "Content-Type": "image/png",
  "SameSite": "None",
}
```

`/* eslint-env node */`

```js
/* eslint-env node */
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
  const base64 = dataURL.slice(22);

  return response({
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "SameSite": "None",
    },
    body: Buffer.from(base64, "base64"),
  });
}
```
