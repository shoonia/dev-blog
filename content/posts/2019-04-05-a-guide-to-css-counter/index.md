---
publish: true
path: '/a-guide-to-css-counter'
template: 'default'
date: '2019-04-05T12:00:00.000Z'
lang: 'ru'
title: 'Руководство по CSS-счетчикам'
description: 'Перевод статьи, Samantha Ming: "A Guide to CSS counter"'
author: 'Samantha Ming'
image: 'https://static.wixstatic.com/media/fd206f_b44adcfd6a6b42dd99de3e9ff80377d6~mv2.png'
---

# Руководство по CSS-счетчикам

*Перевод статьи Samantha Ming: [A Guide to CSS counter](https://www.samanthaming.com/tidbits/53-css-counter). Опубликовано с разрешения автора.*

---
<img
  src="https://static.wixstatic.com/media/e3b156_53480454c29640919bbcf9fc14933037~mv2.jpg"
  width="800"
  height="400"
  alt="A Guide to CSS counter."
/>

Используйте свойство "counter", чтоб превратить любой элемент в нумерованный список.
Аналогично тому, как работает упорядоченный список внутри тега `<ol>`
Это может пригодиться, при создании сайта документации,
где необходимо автоматически нумеровать заголовки или для таблицы с данными. 👍

```css
div {
  /* Объявление и Инициализация Счетчика */
  counter-reset: tidbit-counter;
}

h2::before {
  /* Инкрементирование  */
  counter-increment: tidbit-counter;

  /* Отображение Значения */
  content: counter(tidbit-counter) ": ";
}
```

```html
<div>
  <h2>HTML</h2>
  <h2>CSS</h2>
  <h2>JS</h2>
</div>
```

## Как работает свойство `counter`

Чтоб счетчик заработал необходимо выполнить три шага:

1. Объявление и Инициализация Счетчика
2. Инкрементирование
3. Отображение Значения

### 1. Объявление и Инициализация Счетчика

Этот шаг состоит из двух частей. Вам необходимо объявить счетчик и дать ему имя.

**1a. Объявление Счетчика**

Дадим имя `tidbit-counter`. Мы дали счетчику имя, чтобы была возможность вызвать его в последующих шагах.

```css
counter-reset: tidbit-counter;
```

**1b. Инициализация Счетчика**

Далее мы инициализируем наш счетчик. По умолчанию его значение равно `0`.
Обратите внимание что это значение не отображается.
Здесь вы только устанавливаете "стартовое" значение для счетчика.
То есть, если установить значение `20` вывод будет `21, 22, 23...и т.д`.
Предполагается, что прирост равен `1` (подробнее об этом позже)

| `counter-reset` | Output           |
| --------------- | ---------------- |
| 0               | 1, 2, 3 ...etc   |
| 20              | 21, 22, 23...etc |
| 58              | 59, 60, 61...etc |

Пример:

```css
div {
  counter-reset: tidbit-counter 58; /* 👈 */
}

h2::before {
  counter-increment: tidbit-counter;
  content: counter(tidbit-counter) ": ";
}
```

```html
<div>
  <h2>HTML</h2>
  <h2>CSS</h2>
  <h2>JS</h2>
</div>
```

```
59: HTML
60: CSS
61: JS
```

**Где применять свойство `counter-reset`?**

Вам нужно применять свойство `counter-reset` для родительского компонента.
Вот что случится если вы не примените свойство к родителю.

```css
/* ❌ Неверно */
h2 {
  counter-reset: tidbit-counter;
}

h2::before {
  counter-increment: tidbit-counter;
  content: counter(tidbit-counter) ": ";
}
```

А так выглядит **вывод**. Как вы заметили, счетчик не увеличивается должным образом 😖

```
1: HTML
1: CSS
1: JS
```

Между прочим, контейнером может быть не только прямой родитель.
До тех пор пока это HTML элемент, который оборачивает ваш нумерованный список, все в порядке. Как здесь:

```html
<section>
  <div>
    <h2>HTML</h2>
    <h2>CSS</h2>
    <h2>JS</h2>
  </div>
</section>
```

```css
/* ✅ Работает */
section {
  counter-reset: tidbit-counter;
}
```

```
1: HTML
2: CSS
3: JS
```

### 2. Инкрементирование Счетчика

После того как счетчик был настроен, можно приступить к его увеличению. Синтаксис этого свойства:

```css
counter-increment: <counter name> <integer>
```

Как вы заметили, инкремент принимает вторым аргументом целочисленное значение.
Это означает, что вы не ограничены простым увеличением счетчика на `1`.
На графике ниже предполагается что свойство `counter-reset` равно `0`.

| `counter-increment` | Output             |
| ------------------- | ------------------ |
| 1 (default)         | 1, 2, 3 ...etc     |
| 5                   | 5, 10, 15...etc    |
| -5                  | -5, -10, -15...etc |

И да, вы также можете передавать отрицательные целочисленные значения, чтобы уменьшить счетчик.
Отлично, давайте посмотрим на реализацию:

```css
div {
  counter-reset: tidbit-counter;
}

h2::before {
  counter-increment: tidbit-counter -5; /* 👈 */
  content: counter(tidbit-counter) ": ";
}
```

```html
<div>
  <h2>HTML</h2>
  <h2>CSS</h2>
  <h2>JS</h2>
</div>
```

```
-5: HTML
-10: CSS
-15: JS
```

### 3. Отображение значения

И наконец, для отображения счетчика нам нужно передать функцию `counter` как значение для свойства `content`.
Свойство `content` зачастую позволяет нам отображать значения в HTML через CSS. Синтаксис для функции `counter`:

```css
counter(<counter name>, <counter list style>)
```

По умолчанию используются цифры. Это дефолтное значение для `counter list style` или как это называется в документации `style`.
Но вы также можете использовать и другие стили.

| `style`     | Output            |
| ----------- | ----------------- |
| _default_   | 1, 2, 3 ...etc    |
| upper-alpha | A, B, C ...etc    |
| lower-roman | i, ii, iii ...etc |
| thai        | ๑, ๒, ๓ ...etc    |

[Здесь](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#Values) вы можете посмотреть полный список стилей

И давайте посмотрим на примере:

```css
div {
  counter-reset: tidbit-counter;
}

h2::before {
  counter-increment: tidbit-counter;
  content: counter(tidbit-counter, thai); /* 👈 */
}
```

```html
<div>
  <h2>HTML</h2>
  <h2>CSS</h2>
  <h2>JS</h2>
</div>
```

```
๑HTML
๒CSS
๓JS
```

## Несколько счетчиков

Вы также можете использовать несколько счетчиков, просто дав другое имя для последующего.

```css
div {
  counter-reset: counter-one counter-two 100; /* 👈 */
}

h2::before {
  counter-increment: counter-one;
  content: counter(counter-one) ": ";
}

h3::before {
  counter-increment: counter-two;
  content: counter(counter-two) ": ";
}
```

```html
<div>
  <h2>one</h2>
  <h2>one</h2>

  <h3>two</h3>
  <h3>two</h3>
</div>
```

```
1: one
2: one

101: two
102: two
```

## Вложенные счетчики

Вы также можете использовать вложенные счетчики.
Вместо функции `counter` используйте множественную форму `counters`.
`counters` принимает дополнительный аргумент:

```css
counters(<counter name>, <string>, <counter list style>)
```

Аргумент `string` – это строка разделитель, в которой вы указываете каким образом,
хотите разделить элементы вложенных счетчиков.

| `string`| Output               |
| ------- | -------------------- |
| `"."`   | 1.1, 1.2, 1.3 ...etc |
| `">"`   | 1>1, 1>2, 1>3 ...etc |
| `":"`   | 1:1, 1:2, 1:3 ...etc |

Давайте посмотрим на пример:

```css
div {
  counter-reset: multi-counters;
}

h2::before {
  counter-increment: multi-counters;
  content: counters(multi-counters, ".") ": ";
}
```

```html
<div>
  <h2>Frameworks</h2>
  <div>
    <h2>Vue</h2>
    <h2>React</h2>
    <h2>Angular</h2>
  </div>
</div>
```

```
1: Frameworks
  1.1: Vue
  1.2: React
  1.3: Angular
```

## counter против `<ol>`

CSS счетчики не заменяют `<ol>`.
Если у вас есть пронумерованный упорядоченный список, вам все таки стоит использовать `<ol>`,
важно чтобы разметка HTML была семантически правильно структурирована.
Семантическая разметка имеет решающее значение для доступности и SEO.

**Когда побеждает `<ol>`**

Вот пример, где стоит использовать `<ol>`. В данном случае мне нужно перечислить несколько правил.
Здесь имеет смысл использовать упорядоченный список `<ol>`.

```html
<h2>Правила Бойцовского клуба</h2>

<ol>
  <li>Никогда никому не рассказывать о Бойцовском клубе</li>
  <li>Никогда никому не рассказывать о Бойцовском клубе</li>
</ol>
```

**Когда побеждает CSS `counter`**

Вот пример, где предпочтительнее использовать CSS `counter`.
В этом случае есть страница документации с заголовками `h2` и абзацами `p`.
Здесь наличие счетчика – это скорее визуальное представление.
В этом примере будет иметь смысл использовать CSS `counter`.

```html
<article>
  <h2>Что такое Vue.js?</h2>
  <p>Vue — это прогрессивный фреймворк для создания пользовательских интерфейсов.</p>

  <h2>Начало работы</h2>
  <p>Посетите Vuejs.org, чтобы узнать больше!</p>
</article>
```

```
1: Что такое Vue.js?
Vue — это прогрессивный фреймворк для создания пользовательских интерфейсов.

2: Начало работы
Посетите Vuejs.org, чтобы узнать больше!
```

☝️Вы можете сказать что мне нравится Vue.js 😝

## Браузерная поддержка

Счетчик CSS поддерживаются всеми основными браузерами, включая Internet Explorer 8 и выше.

[Can I Use: CSS Counters](https://caniuse.com/#feat=css-counters)

## Ресурсы

- [MDN Web Docs: Using CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)
- [MDN WebDocs: List Style Type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#Values)
- [w3schools: CSS counter-increment](https://www.w3schools.com/CSSref/pr_gen_counter-increment.asp)
- [w3schools: CSS counter-reset](https://www.w3schools.com/CSSref/pr_gen_counter-reset.asp)
- [CSS Tricks: counter-increment](https://css-tricks.com/almanac/properties/c/counter-increment/)
- [CSS Tricks: counter-reset](https://css-tricks.com/almanac/properties/c/counter-reset/)
- [30 Seconds of CSS](https://30-seconds.github.io/30-seconds-of-css/#counter)
- [Counters and Calc(): Two Little-Known CSS Features Explained](https://creativemarket.com/blog/counters-and-calc-two-little-known-css-features-explained)
- [The Accessibility of ::before and ::after](https://thatdevgirl.com/blog/before-after-accessibility)
- [Accessiblity support for CSS generated content](https://tink.uk/accessibility-support-for-css-generated-content/)

## Поставте лайк ❤️

[Like this on Twitter](https://twitter.com/samantha_ming/status/1109523673470259200)
[Like this on Instagram](https://www.instagram.com/p/BvXHR0phDFW/)

**Спасибо за прочтение ❤**

---

Публикация оригинальной статьи [www.samanthaming.com](https://www.samanthaming.com/tidbits/53-css-counter)
