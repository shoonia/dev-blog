import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

import  { transformHtml } from './util/html.js';
import  { createSitemap } from './util/sitemap.js';
import  { createRss } from './util/rss.js';
import  { getPosts, getSnippets } from './util/filters.js';
import  { compileCss, writeCss } from './util/styles.js';
import  { compileJs } from './util/scripts.js';
import  { siteUrl } from './util/halpers.js';
import  { isProd } from './util/env.js';

export default (config) => {
  let cssCache;
  let classMap;

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/*.!(md)');
  config.addPassthroughCopy('src/_redirects');
  config.addFilter('siteUrl', siteUrl);
  config.addFilter('encodeURIComponent', encodeURIComponent);

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  config.addCollection('posts', (collection) => {
    return getPosts(collection.getAll());
  });

  config.addCollection('snippets', (collection) => {
    return getSnippets(collection.getAll());
  });

  config.addTransform('html', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return transformHtml(content, classMap);
    }

    return content;
  });

  config.on('eleventy.before', async () => {
    [cssCache, classMap] = await compileCss();
  });

  config.on('eleventy.after', async () => {
    await Promise.all([writeCss(cssCache), compileJs()]);
  });

  if (isProd) {
    config.addCollection('__items__', async (collection) => {
      const items = collection.getAll();
      const pages = [
        ...getPosts(items),
        ...getSnippets(items),
      ];

      await Promise.all([
        createRss(pages),
        createSitemap(pages),
      ]);

      return [];
    });
  }

  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: [
      'md',
      'njk',
    ],
  };
};
