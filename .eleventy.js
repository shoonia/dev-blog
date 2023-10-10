const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { transformHtml } = require('./util/html');
const { createSitemap } = require('./util/sitemap');
const { createRss } = require('./util/rss');
const { getPosts, getSnippets } = require('./util/filters');
const { compileCss, writeCss } = require('./util/styles');
const { compileJs } = require('./util/scripts');
const { siteUrl } = require('./util/halpers');
const { isProd } = require('./util/env');

module.exports = (config) => {
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
      'njk'
    ],
  };
};
