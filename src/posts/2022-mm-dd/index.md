---
permalink: '/ajv/'
date: '2022-02-01T12:00:00.000Z'
modified: '2022-02-01T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: '
description: ''
image: '/assets/images/i300x300.jpg'
---

<style>
  ._icon {
    vertical-align: middle;
    margin: 0 0.1em;
  }

  ._error {
    color: #e52f25;
    border-top: solid 1px #fec5c1;
    border-bottom: solid 1px #fec5c1;
    background-color: #fee2e0;
    font-family: var(--font-mono);
    font-size: 0.8em;
    font-weight: 400;
    padding: 0.3em;
  }

  ._error svg {
    vertical-align: text-top;
  }
</style>

<!-- POST -->
# Title

## Data Hooks

<aside>
  <strong>To add a data hook to a collection</strong>: Hover over the collection name in the Velo Sidebar, click the ellipses
  <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 16 16" class="_icon">
    <path fill="#3099ec" d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"/>
    <path fill="#4ba3ed" d="M4 7h2v2H4zm3 0h2v2H7zm3 0h2v2h-2z"/>
  </svg>
  and select <strong>Add/Remove Hooks</strong>
</aside>

[Velo: About Data Hooks](https://support.wix.com/en/article/velo-about-data-hooks)

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

**backend/data.js**

```js
export function users_beforeInsert(item, context) {
  //TODO: write your code here...
}

export function users_beforeUpdate(item, context) {
  //TODO: write your code here...
}
```

## JSON schema

[JSON schema](https://json-schema.org/)

<blockquote cite="https://json-schema.org/">
  <strong>JSON Schema</strong> is a vocabulary that allows you to <strong>annotate</strong> and <strong>validate</strong> JSON documents.
</blockquote>

**Example of the data item**

```json
{
  "name": "Bob",
  "age": 100,
  "email": "bob@email.com"
}
```

[Transform tool - JSON to JSON-Schema](https://transform.tools/json-to-json-schema)

**Automatically generated JSON schema from JSON**

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

## Editor

```text
backend/
├── schemas/
│   ├── index.js
│   ├── test.js
│   └── userSchema.json
└── data.js
```

## Ajv JSON schema validator

[Ajv JSON schema validator](https://ajv.js.org/)

[Velo: Working with npm Packages](https://support.wix.com/en/article/velo-working-with-npm-packages)

**backend/schemas/index.js**

```js
import Ajv from 'ajv';

export const createValidator = (schema) => {
  return new Ajv({
    allErrors: true,
  }).compile(schema);
};
```

**backend/schemas/userSchema.json**

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

## Functional Testing

[Velo: Functional Testing in the Backend](https://support.wix.com/en/article/velo-functional-testing-in-the-backend)

**backend/schemas/test.js**

```js
import { createValidator } from 'backend/schemas';
import userSchema from 'backend/schemas/userSchema.json';

export const test = () => {
  const validator = createValidator(userSchema);

  const isValid = validator({
    name: 'Bob',
    age: 100,
    email: 'bob@email.com'
  });

  console.log(isValid);
  console.log(validator.errors);
}
```

<svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 12 12" class="_icon">
  <circle cx="6" cy="6" r="6" fill="#116dff"/>
  <path d="m4 9.338 5.07-3.17L4 3v6.338Z" fill="#fff"/>
</svg>

**backend/schemas/test.js**

```js
const isValid = validator({
  name: 'Bob',
  // age: 100,
  email: 'bob@email.com'
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

## Customisation JSON Schema

**backend/schemas/userSchema.json**

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

**backend/schemas/index.js**

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

**backend/schemas/userSchema.json**

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
**backend/data.js**

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

## Wix Data Content Manager

[About the Content Manager](https://support.wix.com/en/article/about-the-content-manager-7160473)

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

**backend/schemas/userSchema.json**

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

**backend/schemas/index.js**

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

## Code Snippets

<details>
  <summary>
    <strong>backend/schemas/index.js</strong>
  </summary>

  ```js
  import Ajv from 'ajv';
  import isUUID from 'validator/lib/isUUID';
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
</details>

<details>
  <summary>
    <strong>backend/schemas/userSchema.json</strong>
  </summary>

  ```json
  {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 1,
        "maxLength": 30
      },
      "age": {
        "type": "number"
      },
      "email": {
        "type": "string",
        "kind": "email"
      },
      "title": {
        "type": "string"
      },
      "_id": {
        "type": "string",
        "kind": "uuid"
      },
      "_owner": {
        "type": "string",
        "kind": "uuid"
      },
      "_createdDate": {
        "kind": "date"
      },
      "_updatedDate": {
        "kind": "date"
      }
    },
    "required": [
      "name",
      "age",
      "email"
    ],
    "additionalProperties": false
  }
  ```
</details>

<details>
  <summary>
    <strong>backend/schemas/test.js</strong>
  </summary>

  ```js
  import { createValidator } from 'backend/schemas';
  import userSchema from 'backend/schemas/userSchema.json';

  export const test = () => {
    const validator = createValidator(userSchema);

    const isValid = validator({
      name: 'Bob',
      age: 100,
      email: 'bob@email.com'
    });

    console.log(isValid);
    console.log(validator.errors);
  }
  ```
</details>

<details>
  <summary>
    <strong>backend/data.js</strong>
  </summary>

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
    return validaton(item)
  }

  export function users_beforeUpdate(item, context) {
    return validaton(item)
  }
  ```
</details>

## Resources

## Posts
