---
publish: true
path: '/api-qr-code-generator'
template: 'default'
date: '2019-11-09T12:00:00.000Z'
lang: 'uk'
title: 'Створюємо API для генерації QR Code зображень'
description: 'В цій статі ми розглянемо як за допомогою javascript та Node.js за 15 хвилин можна створити власне HTTP API що буде повертати згенероване QR Code зображення.'
author: 'Олександр Зайцев'
image: 'https://static.wixstatic.com/media/fd206f_54a9c2cb9e664443bfdedaddaed02108~mv2.jpg/v1/fill/w_480,h_480/x.png'
---

# Створюємо API для генерації QR Code зображень

*В цій статі ми розглянемо як за допомогою javascript та Node.js в 15 хвилин можна створити власне HTTP API що буде повертати згенероване QR Code зображення.*

![](https://static.wixstatic.com/media/fd206f_54a9c2cb9e664443bfdedaddaed02108~mv2.jpg/v1/fill/w_250,h_250/x.jpg)

## Створюємо сайт

Саме API ми розгорнимо на безкоштовному сайті Wix.

Для початку нам необхідно зареєструватися на сайті [wix.com](https://uk.wix.com) для цього ви можете використати свій обліковий запис на Facebook або Google, потім нам потрібно створити сайт, щоб ви не витрачали час перейдіть за цим посиланням [Порожнiй шаблон](https://editor.wix.com/html/editor/web/renderer/new?siteId=cbf36d3a-49d0-41c2-9482-1bb58d5fdda3&metaSiteId=a573279f-ae6f-46d1-8556-7c93ae9b2c84). За цим посиланням ми потрапляємо прямісінько в редактор новоствореного сайту. Після цього нам необхідно активувати Corvid. Corvid це розширення можливостей сайтів Wix, що дає нам змогу до написання скриптів як на frontend так і backend. У верхній частині едітора знаходимо пункт меню **"Dev Mode"**, обираємо цей пункт і у розгорнутому підменю тиснемо на кнопку **"Увімкнути Corvid" (Turn on Dev Mode)**.

Після цього зліва повинна з'явитися файлова структура сайту **(Site Structure)**:

- Pages
- Public
- Backend
- node_modules
- База даних
- Мої додатки

Зараз нас цікавлять тільки дві текі, це Backend та `node_modules`. Почнемо з `node_modules`, наводимо на цю теку і зліва з'являється іконка зубчатки, тиснемо на неї та обираємо **"Install a New Pakage"**. Перед нами відкриється **"Менеджер пакетів" (Package Manager)**. В полі пошуку **"Пошук по пакетах" (Search packages)**, вводимо "qrcode", саме за допомогою цієї бібліотеки ми будемо генерувати QR Code, обираємо **"Встановити" (Install)**.

Залишилося тільки опублікувати сайт. В лівій верхній частині сайту тиснемо на кнопку **"Опублікувати" (Publish)**. Вибираємо назву для вашого сайту, в результаті маємо таке посилання:

```
https://<USER_NAME>.wixsite.com/<SITE_NAME>
```

## wix-http-functions

Тепер перейдемо до теки Backend. В цій теці нам потрібно створити js файл **"Hовий файл .js" (New .js File)** з назвою `http-functions.js`. Ми повинні створити файл саме с такою назвою. Після створення файлу в ньому є код с прикладом, ми не будемо розглядати цей приклад і створимо послідовно все з початку. Видаляємо зразок та починаємо.

### Найменування функцій

Для створення роутингу в файлі `http-functions.js` нам потрібно експортувати функції назва яких складається з префіксу та назви роуту розділених нижнім підкреслюванням.

```js
 export function <prefix>_<functionName>(request) { }
```

- `<prefix>` - це назва методу запиту (GET, POST, PUT ...) Докладніше на [MDN](https://developer.mozilla.org/uk/docs/Web/HTTP/Methods)
- `<functionName>` - це назва роуту на який ми будимо відправляти запити.
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

Для того щоб наше API мало змогу відповідати на запити, нам потрібно експортувати модуль [wix-http-functions](https://www.wix.com/corvid/reference/wix-http-functions.html) - це внутрішній модуль Wix сайтів що містить функціональність для роботи з HTTP. Ми будимо використовувати [response](https://www.wix.com/corvid/reference/wix-http-functions.html#response):

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

Тепер необхідно опублікувати наші зміни, тиснемо на кнопку **"Опублікувати" (Publish)** і переходимо за адресою: `https://<USER_NAME>.wixsite.com/<SITE_NAME>/_functions/qrcode`, результат `Hello`.

Реалізуємо передачу тексту за допомогою параметрів запиту. Всі передані параметри ми можемо отримати за допомогою об'єкту `request.query`. Також нам необхідно декодувати переданий текст за допомогою функції [`decodeURIComponent(encodedURI)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)

**backend/http-functions.js**
```js
import { response } from "wix-http-functions";

// ?text=Hello
export function get_qrcode(request) {
  // Текст передається як частина адреси запиту,
  // тому частина символів може буде задзеркальна в керовані послідовності UTF-8
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

## QR Code

На початку ми додали бібліотеку [qrcode](https://github.com/soldair/node-qrcode) за допомогою якої будемо генерувати зображення. Ми використаємо метод який поверне нам [`data:URL`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).

```js
import QRCode  from "qrcode";

const text = "Hello";

QRCode.toDataURL(text, (error, url) => {
  console.log(url); // data:URL
});
```
`QRCode.toDataURL()` - це асинхронна функія яка приймає текст з якого дубе генеруватися QR Code, та функцію зворотного виклику, яка буде викликана коли зображення згенероване. Для зручности обернемо в Promise за допомогою [`util.promisify(original)`](https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_promisify_original):

```js
import QRCode  from "qrcode";
import util from "util";

const getDataURL = util.promisify(QRCode.toDataURL);
```

Наш код виконується асинхронно, тому нам потрібно перетворити наш роут на асинхронну функцію.

**backend/http-functions.js**
```js
import { response } from "wix-http-functions";
import QRCode from "qrcode";
import util from "util";

const getDataURL = util.promisify(QRCode.toDataURL);

// Додаємо оператор async
export async function get_qrcode(request) {
  const text = decodeURIComponent(request.query.text);
  // Чекаємо коли виконається генерація зображення
  const dataURL = await getDataURL(text);

  return response({
    status: 200,
    body: dataURL,
  });
}
```

Не забуваємо опублікувати наші зміни.
Зараз ми маємо API яке здатне повертати QR Code зображення у вигляди `data:URL` строки. Ми вже зараз можемо використовувати цей протокол щоб побачити QR Code зображення:

*HTML*

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK0SURBVO3BSY7kQAwEQQ9C//+yTx95SkCQqhcOzeIX1hjFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUa5eCgJ30nlJAlPqHRJ+E4qTxRrlGKNUqxRLl6m8qYk3KFyRxLuUHlTEt5UrFGKNUqxRrn4sCTcoXJHEjqVLgmdypuScIfKJxVrlGKNUqxRLv5zKpMUa5RijVKsUS6GSUKncpKETuUvK9YoxRqlWKNcfJjKb5KETuUJld+kWKMUa5RijXLxsiT8JJUuCZ1Kl4RO5SQJv1mxRinWKMUa5eIhlb9M5UTlLynWKMUapVijXDyUhE6lS8KbVDqVLgmdSpeETuUkCW9S+aRijVKsUYo1ysVDKicqXRI6lSeS0KnckYQ7VE6ScEcSOpUnijVKsUYp1ijxCx+UhDepnCThRKVLQqfSJeFEpUvCHSpvKtYoxRqlWKNcfDOVkyR0Kl0STlS6JHRJOEnCicoTKp9UrFGKNUqxRolfeFES7lA5ScKbVLokdConSehUnkhCp/JEsUYp1ijFGuXiZSpvUjlJQqfyk5LQqZyovKlYoxRrlGKNEr/wQBK+k8pJEjqVLgmdSpeETuUkCZ1Kl4QTlTcVa5RijVKsUS5epvKmJJwkoVPpktCpnKicJOEkCT+pWKMUa5RijXLxYUm4Q+VNKl0SOpUuCZ1Kp9IloVM5ScInFWuUYo1SrFEuhklCp3KShJMknKh0SehUOpVPKtYoxRqlWKNc/GdUuiR0Kl0S7lDpktCpfFKxRinWKMUa5eLDVD5JpUvCSRJOknCi0iXhNynWKMUapVijXLwsCd8pCXeodEnoVJ5QOUlCp/KmYo1SrFGKNUr8whqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYo/wDUsBPle3QEgQAAAABJRU5ErkJggg==">
```

## PNG

Hам залишилось тільки перетворити `data:URL` строку в справжнє зображення. Щоб відповідь нашого API браузер розпізнавав як зображення нам потрібно перетворити його на буферний масив біт та додати заголовок у відповідь з типом контенту.

Почнемо

```
data:image/png;base64,<data>
```

- `data:` - це протокол
- `image/png` - MIME тип контенту
- `;base64` - кодировка
- `<data>` - закодоване зображення

Нам потрібне лише саме зображення тому відрізаємо всю мета інформацію до коми, перші 22 символи:

```js
const base64 = dataURL.slice(22);
```

Щоб створити масив біт в Node.js використаємо [`Buffer.from(string[,encoding])`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)

```js
Buffer.from(base64, "base64");
```
Також нам потрібно додати заголовки до відповіді

```js
{
  "Content-Type": "image/png",
  SameSite: "None",
}
```

Збираємо все до купи

**backend/http-functions.js**
```js
/* eslint-env node */
import { response } from "wix-http-functions";
import QRCode  from "qrcode";
import util from "util";

const getDataURL = util.promisify(QRCode.toDataURL);

export async function get_qrcode(request) {
  const text = decodeURIComponent(request.query.text);
  const dataURL = await getDataURL(text);
  const base64 = dataURL.slice(22);

  return response({
    status: 200,
    headers: {
      "Content-Type": "image/png",
      SameSite: "None",
    },
    body: Buffer.from(base64, "base64"),
  });
}
```

Прaцює!

```html
<img src="https://shoonia.wixsite.com/blog/_functions/qrcode?text=Дякую%20за%20увагу!">
```

![Дякую за увагу!](https://shoonia.wixsite.com/blog/_functions/qrcode?text=Дякую%20за%20увагу!)

## Посилання
- [wix-http-functions](https://www.wix.com/corvid/reference/wix-http-functions.html)
- [node-qrcode](https://github.com/soldair/node-qrcode)                         
- [Data:URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [`decodeURIComponent(encodedURI)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
- [`util.promisify(original)`](https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_promisify_original)
- [`Buffer.from(string[,encoding])`](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding)
