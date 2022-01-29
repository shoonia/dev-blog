---
permalink: '/ajv/'
date: '2022-01-29T12:00:00.000Z'
modified: '2022-01-29T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: '
description: ''
image: '/assets/images/i300x300.jpg'
---

[Ajv JSON schema validator](https://ajv.js.org/)

```json
{
  "name": "Bob",
  "age": 100,
  "email": "bob@mail.com"
}
```

[Transform tool - JSON to JSON-Schema](https://transform.tools/json-to-json-schema)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    },
    "email": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "age",
    "email"
  ]
}
```

```diff
{
- "$schema": "http://json-schema.org/draft-07/schema#",
- "title": "Generated schema for Root",
  "type": "object",
  "properties": {…},
  "required": […],
+ "additionalProperties": false
}
```

```js
import Ajv from 'ajv';

export const createValidator = (schema) => {
  return new Ajv({
    allErrors: true,
  }).compile(schema);
};
```

```js
import { createValidator } from 'backend/schemas';
import userSchema from 'backend/schemas/userSchema.json';

export const test = () => {
  const validator = createValidator(userSchema);

  const isValid = validator({
    name: 'Bob',
    age: 100,
    email: 'bob@mail.com'
  });

  console.log(isValid);
  console.log(validator.errors);
}
```

```js
const isValid = validator({
  name: 'Bob',
  // age: 100,
  email: 'bob@mail.com'
});
```

**View Function Output**

```json
[
  {
    "instancePath": "",
    "schemaPath": "#/required",
    "keyword": "required",
    "params": {
      "missingProperty": "age"
    },
    "message": "must have required property 'age'"
  }
]
```

```diff
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
+     "minLength": 1,
+     "maxLength": 30
    },
    "age": {…},
    "email": {…}
  },
  "required": […],
  "additionalProperties": false
}
```

```js
import Ajv from 'ajv';
import isEmail from 'validator/lib/isEmail';

export const createValidator = (schema) => {
  return new Ajv({
    allErrors: true,
  })
    .addKeyword({
    keyword: 'kind',
    compile(name) {
      return (data) => {
        switch (name) {
          case 'email':
            return isEmail(data);

          default:
            return false;
        }
      };
    },
  })
  .compile(schema);
};
```

```diff
{
  "type": "object",
  "properties": {
    "name": {…},
    "age": {…},
    "email": {
      "type": "string"
+     "kind": "email"
    }
  },
  "required": […],
  "additionalProperties": false
}
```

<figure>
  <figcaption>
    <strong>Add Hooks</strong>
  </figcaption>
  <img
    src="/assets/images/av0.jpg"
    alt="wix editor - the window for adding data hooks"
    loading="lazy"
  />
</figure>

```js
export function users_beforeInsert(item, context) {
  //TODO: write your code here...
}

export function users_beforeUpdate(item, context) {
  //TODO: write your code here...
}
```

```js
import { createValidator } from 'backend/schemas';
import userSchema from 'backend/schemas/userSchema.json';

const validaton = (item) => {
  const validator = createValidator(userSchema);

  if (validator(item)) {
    return item;
  }

  return Promise.reject(
    validator.errors.map((i) => i.message).join('\n'),
  );
};

export function users_beforeInsert(item, context) {
  return validaton(item);
}

export function users_beforeUpdate(item, context) {
  return validaton(item);
}
```

<style>
  ._error {
    color: #e52f25;
    border-top: solid 1px #fec5c1;
    border-bottom: solid 1px #fec5c1;
    background-color: #fee2e0;
    font-family: var(--font-mono);
    font-size: 0.8em;
    font-weight: 400;
    padding: 1em;
  }

  ._error svg {
    vertical-align: text-top;
  }
</style>

**View Function Output**

<div class="_error">
  <svg width="16" height="16">
    <path fill="none" d="M0 0h16v16H0z"/>
    <circle cx="7.5" cy="8.5" r="5.5" fill="currentColor"/>
    <path fill="#fff" d="M7 6h1v3H7zm0 5h1v1H7z"/>
  </svg>
  <span> "must NOT have additional properties"</span>
</div>

<figure>
  <figcaption>
    <strong>Wix Content Manager: Manage fields</strong>
  </figcaption>
  <img
    src="/assets/images/av.jpg"
    alt="content manager - hidden and visible fields panel"
    loading="lazy"
  />
</figure>

```diff
{
  "type": "object",
  "properties": {
    "name": {…},
    "age": {…},
    "email": {…},
+   "title": {
+     "type": "string"
+   },
+   "_id": {
+     "type": "string",
+     "kind": "uuid"
+   },
+   "_owner": {
+     "type": "string",
+     "kind": "uuid"
+   },
+   "_createdDate": {
+     "kind": "date"
+   },
+   "_updatedDate": {
+     "kind": "date"
+   }
  },
  "required": […],
  "additionalProperties": false
}
```

```js
import Ajv from 'ajv';
import isEmail from 'validator/lib/isEmail';
import isUUID from 'validator/lib/isUUID';

export const createValidator = (schema) => {
    return new Ajv({
      allErrors: true,
    })
     .addKeyword({
      keyword: 'kind',
      compile(name) {
        return (data) => {
          switch (name) {
            case 'email':
              return isEmail(data);

            case 'uuid':
              return isUUID(data);

            case 'date':
             return data && data instanceof Date;

            default:
              return false;
          }
        };
      },
    })
    .compile(schema);
};
```
