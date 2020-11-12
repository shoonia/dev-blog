---
publish: true
path: '/smaller-bundle-size-by-importing-npm-package-correctly'
template: 'default'
date: '2020-11-12T12:00:00.000Z'
lang: 'en'
title: 'Corvid by Wix: Smaller bundle size by importing npm package correctly'
description: 'If use npm dependencies in the project, then the way of importing code from the package may influence the bundle size. In this note, we consider a few ways of the modules importing and try to find the best one.'
author: 'Alexander Zaytsev'
image: 'https://static.wixstatic.com/media/358a0d_049725d1d0ef40c98ae2f6f73cc2368d~mv2.jpg/v2/fill/w_500,h_500/o_0.jpg'
---

# Corvid by Wix: Smaller bundle size by importing npm package correctly

*If use npm dependencies in the project, then the way of importing code from the package may influence the bundle size. In this note, we consider a few ways of the modules importing and try to find the best one.*

<img
  src="https://static.wixstatic.com/media/358a0d_049725d1d0ef40c98ae2f6f73cc2368d~mv2.jpg"
  width="1874"
  height="1054"
  alt="node_modules"
  crossorigin="anonymous"
/>

Let's start with a small library [uuid](https://www.npmjs.com/package/uuid) that use for the creation of unique IDs. In the documentation, we can see how to use it with ES6 module syntax.

```js
import { v4 as uuid } from 'uuid';

console.log(uuid()); // 687c4d60-1e67-466e-bbf3-b8f4ffa5f540
```

Above, we import the version 4, but the reality, all library with all functionality gets on our bundle, and the app bundle size grows up +12.8KB (gzip: 5.8KB). It includes all versions of the library and all util methods for validation, parsing, and more else.

Yep, it's will just a dead code in the project, that only doing the bundle size bigger.

## What's inside npm package?

Usually, the source code of many popular open-source library hosts on the GitHub repository. It's a great place to looking for documentation, examples and for learning how the work the code under the hood.

On GitHub, we can't understand which code gets to the package after the CI cycle. The source code may use the preprocessing before publishing to npm, for example, it could be compiled from TypeScript or Babel.

The better way, it's to explore the published npm package. We can do it with [RunKit](https://npm.runkit.com/) service. There in RunKit we to able to walk inside the package and found all files in the module that we can use.

Come back to uuid.

I found the `v4` in the `dist` folder: [uuid/dist/v4.js](https://npm.runkit.com/uuid/dist/v4.js). Let's just try to import only needed file:

```js
import uuid from 'uuid/dist/v4';
```

*Yes, now we have a smaller bundle size that is +3.0KB (gzip: 2.4KB) against +12.8KB (gzip: 5.8KB) at the start.*

This approach for importing to very helpful with another popular library - [lodash](https://lodash.com/docs/4.17.15). I guess you already have been had experience work with lodash yet. Lodash, it's a namespace that contains more than 100 utils to work with data.
And again, if we want one of the methods from the library, we get a full library into the app bundle.

```js
import _ from 'lodash';

const lang = _.get(customer, 'language.code', 'en');
```

*Bundle size grows +73.5KB (gzip: 29.0KB).*

Unfortunately, the named import doesn't work on Corvid platform. The next code will get the same result as above.

```js
import { get } from 'lodash';
```

*Still bundle size grows +73.5KB (gzip: 29.0KB).*

And here we can use the same way which we consider with uuid. Import only needed file:

```js
import _get from 'lodash/get';
```

*Bundle size grows +10.9KB (gzip: 4.7KB).*

### Attention!

For using this approach, you have to understand how is work the package. This approach is grad for libraries that is a collection of independent utility (like: [uuid](https://github.com/uuidjs/uuid), [lodash](https://lodash.com/), [validator](https://github.com/validatorjs/validator.js), [ramda](https://ramdajs.com/), [underscore](https://underscorejs.org/), etc) when each method has an atomic functional.

If you support the legacy browser, pay attention to JS syntax in the file (ES5, ES2015).

## Conclusion

Am I need this package? The Corvid supports JavaScript until of ES2017 version. Maybe your issue may solve by new JavaScript features without three-party libraries?

Is my favorite package still good enough? Learn the npm packages that you use most often, and don't forget to look at the alternative. With time, even the best solutions are to become old. [The Moment.js docs have a great example](https://momentjs.com/docs/#/-project-status/recommendations/) where authors recommend using some modern packages instead of Moment.js.

## Resources

- [bundlephobia.com](https://bundlephobia.com/) - the great service to query package sizes.
- [RunKit](https://npm.runkit.com/) - playground to test code.

## Posts

- [Event handling of Repeater Item](/event-handling-of-repeater-item/)
- [A tiny event-based state manager Storeon for Corvid.](/corvid-storeon/)
- [Using HTML template to the better performance](/html-template-in-corvid/)
