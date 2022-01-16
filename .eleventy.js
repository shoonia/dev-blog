const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { transformHtml } = require('./util/html');
const { sitemapAndRss } = require('./util/sitemapAndRss');
const { compileAssets } = require('./util/assets');
const { getPosts } = require('./util/filters');
const { getClassNames } = require('./util/styles');
const { siteUrl } = require('./util/halpers');
const { isProd } = require('./util/env');

module.exports = (config) => {
  let cssCache;
  let classMap;

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/*.!(md)');
  config.addPassthroughCopy('src/_redirects');
  config.addFilter('siteUrl', siteUrl);

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  config.addCollection('posts', (collection) => {
    return getPosts(collection.getAll());
  });

  config.addTransform('html', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return transformHtml(content, classMap);
    }

    return content;
  });

  if (isProd) {
    config.addCollection('__rss__sitemap', async (collection) => {
      await sitemapAndRss(getPosts(collection.getAll()));
      return [];
    });
  }

  config.on('eleventy.before', async () => {
    [cssCache, classMap] = await getClassNames();
  });

  config.on('eleventy.after', async () => {
    await compileAssets(cssCache);
  });

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
