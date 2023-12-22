---
permalink: '/custom-pagination-with-unique-urls/'
date: '2021-09-08T12:00:00.000Z'
modified: '2022-06-07T12:00:00.000Z'
lang: 'en'
title: 'Velo by Wix: Custom pagination with unique URLs'
description: 'Creating a custom pagination element with Velo'
image: '/assets/images/pagination.png'
---

# Velo by Wix: Custom pagination with unique URLs

<img
  src="/assets/images/pagination.png"
  alt="the illustration depicting a pagination component on the web page"
/>

The Wix Blog App has built-in pagination with links. Each button on the pagination element has a unique link. Links are required for good SEO.

I have reproduced the pagination element that uses unique URLs and creates my own implementation. (Lots of code 😳)

For that, I use a [wix-router](https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/routers/about-routers) on the server part and I generating custom pagination by [Repeater](https://www.wix.com/velo/reference/$w/repeater) on the front-end part.

So pagination is a difficult component. I share my solution I hope it will be helpful (interesting) to take a look at how it works.

**[Live Demo](https://alexanderz5.wixsite.com/pagination/custom-blog)**

## Code

**Route logic for pagination.**

We create a router page named `custom-blog-page`. With [wix-router](https://www.wix.com/velo/reference/wix-router) APIs, we can dynamically return any data to the router page from the server hook.

I use regular Wix Blog databases. These collections are created when you [add a Wix Blog App](https://support.wix.com/en/article/wix-blog-creating-your-blog) to your site. In the router, we are able to use any kind of database collection.

In the router, we have four URLs types that we will handle:

```text
/custom-blog                       - First page for all post categories
/custom-blog/:pageNumber           - Pagination page for all post categories
/custom-blog/:category             - First page for specific post categories
/custom-blog/:category/:pageNumber - Pagination page for specific post categories
```

In the router hook, we are parsing a request path. If request params are valid then we receive data from collections and return it to the page.

<details>
  <summary>
    <strong>backend/routers.js</strong>
  </summary>

```js
import wixData from 'wix-data';
import { ok, redirect, WixRouterSitemapEntry } from 'wix-router';
// The 'url-join' external npm library.
// It has to be installed with npm Package Manager before writing a code.
// More: https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/packages/working-with-npm-packages
import urlJoin from 'url-join';

const hasContent = (val) => typeof val === 'string' && val.trim() !== '';
const isNumeric = (val) => hasContent(val) && /^[\d]+$/.test(val);
const parseNumber = (val) => ~~Math.abs(+val);

// I use regular Wix Blog databases.
// These collections are created when you add a Wix Blog app in your site.
// More: https://support.wix.com/en/article/wix-blog-adding-and-setting-up-your-blog
const getCategories = () => {
  return wixData
    .query('Blog/Categories')
    .find()
    .then((result) => result.items);
};

const getCategory = (label) => {
  return wixData
    .query('Blog/Categories')
    .eq('label', label)
    .limit(1)
    .find()
    .then((reslut) => reslut.items[0]);
};

const getPosts = async (pageSize, skipPages, categoryId = null) => {
  let dataQuery = wixData.query('Blog/Posts');

  if (hasContent(categoryId)) {
    dataQuery = dataQuery.hasAll('categories', categoryId);
  }

  return dataQuery
    .skip(skipPages)
    .limit(pageSize)
    .find();
};

const getParams = async (path) => {
  const [one, two] = path.map((i) => i.toLowerCase());

  if (path.length === 1) {
    if (one === '') {
      return {
        page: 0,
        label: '',
      };
    }

    if (isNumeric(one)) {
      return {
        page: parseNumber(one),
        label: '',
      };
    }

    const category = await getCategory(one);

    if (typeof category !== 'undefined') {
      return {
        page: 0,
        categoryId: category._id,
        label: category.label,
      };
    }
  }

  if (path.length === 2 && isNumeric(two)) {
    const category = await getCategory(one);

    if (typeof category !== 'undefined') {
      return {
        page: parseNumber(two),
        categoryId: category._id,
        label: category.label,
      };
    }
  }

  return { hasError: true };
};

/**
 * Router hook
 *
 * @param {import('wix-router').WixRouterRequest} request
 */
export async function custom_blog_Router({ path, baseUrl, prefix }) {
  const params = await getParams(path);

  // Invalid params. Redirect to a base route URL.
  if (params.hasError) {
    return redirect(urlJoin(baseUrl, prefix), '301');
  }

  // Page size. It controls how many posts we show on the page.
  const pageSize = 2;
  const skip = (params.page === 0 ? 0 : params.page - 1) * pageSize;

  const postsData = await getPosts(
    pageSize,
    skip,
    params.categoryId,
  );

  // Returns a router page data to client
  return ok('custom-blog-page', {
    pageSize,
    posts: postsData.items,
    currentPage: postsData.currentPage,
    totalCount: postsData.totalCount,
    totalPages: postsData.totalPages,
    label: params.label,
  });
}

/**
 * Generate sitemaps
 * https://www.wix.com/velo/reference/wix-router/sitemap
 *
 * @param {import('wix-router').WixRouterSitemapRequest} request
 * @returns {Promise<import('wix-router').WixRouterSitemapEntry[]>}
 */
export async function custom_blog_SiteMap({ prefix }) {
  const categories = await getCategories();

  return categories.map((i) => {
    const entry = new WixRouterSitemapEntry(i.label);

    return Object.assign(entry, {
      title: i.label,
      pageName: i.label,
      url: urlJoin('/', prefix, i.label),
    });
  });
}
```
</details>

**Route page with blog posts repeater's and custom pagination.**

On the router page, we are able to get data that we return from the router hook. We use route data to create custom pagination with the [Repeater](https://www.wix.com/velo/reference/$w/repeater/introduction) element.

<details>
  <summary>
    <strong>Custom Blog Page (code):</strong>
  </summary>

```js
import { getRouterData } from 'wix-window';
import { prefix } from 'wix-location';
import urlJoin from 'url-join';

import { paginate } from 'public/paginate';

/**
 * Join paths to URL prefix
 *
 * @param {...string} paths
 * @returns {string}
 */
const join = (...paths) => urlJoin('/', prefix, ...paths);

$w.onReady(function () {
  // Here we get router data that we return from "backend/routers.js"
  const {
    posts,
    currentPage,
    totalCount,
    pageSize,
    label,
  } = getRouterData();

  // The function for generating repeater data.
  // It's our custom repeater source.
  const { data } = paginate({
    totalCount,
    currentPage,
    maxPages: 4,
    pageSize,
  });

  // Repeater for posts
  $w('#repeaterPosts').data = posts;
  $w('#repeaterPosts').forEachItem(($item, itemData) => {
    $item('#textTitle').text = itemData.title;
  });

  // Repeater for custom pagination
  $w('#repeaterPagination').data = data;
  $w('#repeaterPagination').forEachItem(($item, itemData) => {
    $item('#button1').label = itemData.label;

    if (itemData.isActive) {
      $item('#button1').link = join(label, String(itemData.number));
    } else {
      $item('#button1').disable();
    }
  });

  // Build a links for categories
  $w('#buttonLinkAll').link = join('');
  $w('#buttonLinkCss').link = join('css');
  $w('#buttonLinkHtml').link = join('html');
  $w('#buttonLinkJs').link = join('js');
});
```
</details>

**Pagination logic.**

This file contains logic for generating a [repeater data](https://www.wix.com/velo/reference/$w/repeater/data) array. It's the most difficult part of custom pagination for me, the logic of calculating the position of repeater items.

<details>
  <summary>
    <strong>public/paginate.js</strong>
  </summary>

```js
/**
 * @typedef {{
 * totalCount: number;
 * currentPage: number;
 * pageSize: number;
 * maxPages: number;
 * }} Params
 *
 * @typedef {{
 * _id: string;
 * label: string;
 * number: number;
 * isActive: boolean;
 * }} Data
 *
 * @param {Params} params
 * @returns {{ data: Data[] }}
 */
export const paginate = ({
  totalCount,
  currentPage,
  pageSize,
  maxPages,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  let startPage = 1;
  let endPage = totalPages;

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  if (totalPages > maxPages) {
    const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2);

    if (currentPage <= maxPagesBeforeCurrentPage) {
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxPages + 1;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  const length = (endPage + 1) - startPage;

  /** @type {Data[]} */
  const data = Array.from({ length },
    (_, index) => {
      const number = startPage + index;
      const id = String(number);

      return {
        _id: id,
        label: id,
        number,
        isActive: number !== (currentPage + 1),
      };
    },
  );

  data.unshift({
    _id: 'first',
    label: '<<',
    number: 1,
    isActive: currentPage > 0,
  }, {
    _id: 'prev',
    label: '<',
    number: currentPage,
    isActive: currentPage > 0,
  });

  data.push({
    _id: 'next',
    label: '>',
    number: currentPage + 2,
    isActive: (currentPage + 1) < totalPages,
  }, {
    _id: 'last',
    label: '>>',
    number: totalPages,
    isActive: (currentPage + 1) < totalPages,
  });

  return {
    data,
  };
};
```
</details>

If you have a question then welcome to [discussion on Velo forum](https://www.wix.com/velo/forum/tips-tutorials-examples/custom-pagination-with-unique-urls).

## Resources

- [Live Demo](https://alexanderz5.wixsite.com/pagination/custom-blog)
- [Wix Blog: Creating Your Blog](https://support.wix.com/en/article/wix-blog-adding-and-setting-up-your-blog)
- [wix-router](https://www.wix.com/velo/reference/wix-router)

## Posts

- [The utils for repeated item scope event handlers](/the-utils-for-repeated-item-scope-event-handlers/)
- [Reduce server-side calls using a caching mechanism](/cache-for-the-jsw-functions/)
- [Message channel to iFrame](/message-channel-to-iframe/)
