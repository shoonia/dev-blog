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

## Створюємо сайт

Саме API ми розгорнимо на безкоштовному сайті Wix.

Для початку нам необхідно зареєструватися на сайті [wix.com](https://uk.wix.com) для цього ви можете використати свій обліковий запис на Facebook або Google, потім нам потрібно створити сайт, щоб ви не витрачали час перейдіть за цим посиланням [Порожнiй шаблон](https://editor.wix.com/html/editor/web/renderer/new?siteId=cbf36d3a-49d0-41c2-9482-1bb58d5fdda3&metaSiteId=a573279f-ae6f-46d1-8556-7c93ae9b2c84). За цим посиланням ми потрапляємо прямісінько в редактор новоствореного сайту. Після цього нам необхідно активувати Corvid. Corvid це розширення можливостей сайтів Wix, що дає нам змогу до написання скриптів як на frontend так і backend. У верхній частині едітора знаходимо пункт меню "Dev Mode", обираємо цей пункт і у розгорнутому підменю тиснемо на кнопку "Увімкнути Corvid" (Turn on Dev Mode).

Після цього зліва повинна з'явитися файлова структура сайту (Site Structure):

- Pages
- Public
- Backend
- node_modules
- База даних
- Мої додатки

Зараз нас цікавлять тільки дві текі, це Backend та node_modules. Почнемо з node_modules, наводимо на цю теку і зліва з'являється іконка зубчатки, тиснемо на неї та обираємо "Install a New Pakage". Перед нами відкриється "Менеджер пакетів" (Package Manager). В полі пошуку "Пошук по пакетах" (Search packages), вводимо "qrcode", саме за допомогою цієї бібліотеки ми будемо генерувати QR Code, обираємо "Встановити" (Install).

Залишилося тільки опублікувати сайт. В лівій верхній частині сайту тиснемо на кнопку "Опублікувати" (Publish). Вибираємо назву для вашого сайту, в результаті маємо таке посилання:

```
https://<USER_NAME>.wixsite.com/<SITE_NAME>
```

## wix-http-functions

Тепер перейдемо до теки Backend. В цій теці нам потрібно створити js файл "Hовий файл .js" (New .js File) з назвою `http-functions.js`. Ми повинні створити файл саме с такою назвою. Після створення файлу в ньому є код с прикладом, ми не будемо розглядати цей приклад і створимо послідовно все з початку. Видаляємо зразок та починаємо.

### Найменування функцій

Для створення роутінгу в файлі `http-functions.js` нам потрібно експортувати функції назва яких складається з префіксу та назви роуту розділених нижнім підкреслюванням.

```js
 export function <prefix>_<functionName>(request) { }
```

- `<prefix>` - це назва методу запиту (GET, POST, PUT ...) Докладніше на [MDN](https://developer.mozilla.org/uk/docs/Web/HTTP/Methods)
- `<functionName>` - це назва роуту на який ми будимо відправляти запити в нашому API.
- `request` - це oб'єкт який містить параметри вхідних даних. Докладніше [Corvid Reference](https://www.wix.com/corvid/reference/wix-http-functions.WixHttpFunctionRequest.html)

Створімо роут для методу GET з назвою qrcode:

**backend/http-functions.js**

```js
export function get_qrcode(request) {
  // TODO: ...
}
```

Зараз ми можемо відправляти GET запити на `_functions/qrcode`. Повна адреса буде виглядати так:

```
https://<USER_NAME>.wixsite.com/<SITE_NAME>/_functions/qrcode
```

### Відповідь на запит

Для того щоб наше API мало змогу нам відповідати, нам потрібно експортувати модуль [wix-http-functions](https://www.wix.com/corvid/reference/wix-http-functions.html). В цьому прикладі ми будимо використовувати функцію [response](https://www.wix.com/corvid/reference/wix-http-functions.html#response):

**backend/http-functions.js**
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

Тепер необхідно опублікувати наші зміни, тиснемо на кнопку "Опублікувати" (Publish) і переходимо за адресою: `https://<USER_NAME>.wixsite.com/<SITE_NAME>/_functions/qrcode`, результат `Hello`.

`?text=Hello`

`request.query.text`

`hello world` `hello%20world`

`decodeURIComponent(request.query.text);`

**backend/http-functions.js**
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

**backend/http-functions.js**
```js
import { response } from "wix-http-functions";
import QRCode from "qrcode";

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

**backend/http-functions.js**
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
