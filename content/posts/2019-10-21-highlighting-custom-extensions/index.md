---
publish: true
path: '/highlighting-custom-extensions'
template: 'default'
date: '2019-10-21T12:00:00.000Z'
lang: 'ru'
title: 'Подсветка кастомных файлов/расширений в редакторе VS Code'
description: ''
author: 'Alexander Zaytsev'
image: 'https://miro.medium.com/max/764/1*HqWGL8OipT8z9jfAN3jTxQ.png'
---

# Подсветка кастомных файлов/расширений в редакторе VS Code
![](https://static.wixstatic.com/media/e3b156_19f2ed5a0e214c329ae99a998e5e4f6e~mv2.png)

Часто в проектах встречаются файлы конфигураций без расширения такие как `.postcssrc` или `.parcelrc`. Если ваш редактор кода не знаком с данным типом файла он применит к нему дефолтные стили подсветке синтаксиса, в VS Code это `html`.

Мы можем поискать и установить новое расширение для VS Code, или можем подсказать едитору что внутри `.parcelrc` файла лежит именно JSON код. Для этого в корне проекта создадим новую папку `.vscode` c файлом `settings.json` внутри.

```bash
my-app
├── .vscode
│   └── settings.json
├── src
│   └── index.js
├── .parcelrc
└── .postcssrc
```

В файле `settings.json` мы пропишем настройки, которые будут примениться в конкретно данном проекте.

**.vscode/settings.json**
```json
{
  "files.associations": {
    ".parcelrc": "json",
    ".postcssrc": "json"
  }
}
```

Слева мы указали название файла, а справа код языка с которым будут ассоциироваться файл. Отлично! Теперь к нашим конфигурациям едитор будет примерять правила подсветки JSON.

## Шаблоны поиска

Мы указали названия файлов целиком, и правила подсветки будут примениться только в случае полного совпадения с названия файла. А что если нам нужно указать расширения файла у которого может быть, любое названием?

Я работаю на платформе Corvid, где есть файлы с расширением `.jsw`. В этих файлах лежит обычный javascript, а данное расширение нужно только на этапе сборки для *спец* компиляции.

Здесь нам понадобятся шаблоны поиска, в VS Code используется формат поиска glob.

**.vscode/settings.json**
```json
{
  "files.associations": {
    "*.jsw": "javascript"
  }
}
```

Тут мы указали что название файла может содержать любые символы (*) и должно заканчиваться строго на `.jsw`. Подробно с glob можно ознакомится [здесь](https://github.com/isaacs/node-glob).

## Глобальные настройки

До этого мы указывали настройки для одного конкретного проекта. А что если мы не хотим *копипастить* одни и те же конфиги между проектами, а добавить поддержке нужного нам расширения глобально. Давайте для этого поменяем пользовательские настройки редактора.

### Выполним пару команд

- В VS Code набираем комбинацию клавиш для Window, Linux: <kbd>Ctrl+Shift+P</kbd> для MacOS: <kbd>⇧⌘P</kbd>.
- Вводим в поиске `Preferences: Open Settings (JSON)`.
- Добавляем в JSON объект знакомый нам код:

```js
{
  /* тут могут быть всякие там настройки .... */

  "files.associations": {
    "*.jsw": "javascript"
  }
}
```

Теперь ваш редактор знает как работать с нужными вам файлами 🎉

## Ссылочки
- [VS Code: docs](https://code.visualstudio.com/docs/languages/overview#_language-id)
- [VS Code: language identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)
- [Glob docs](https://github.com/isaacs/node-glob)
