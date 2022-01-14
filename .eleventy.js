const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { transformHtml } = require('./util/html');
const { sitemapAndRss } = require('./util/sitemapAndRss');
const { vendorScript, vendorStyles } = require('./util/assets');
const { getPosts, getAllPages } = require('./util/filters');
const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

module.exports = (config) => {
  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/*.!(md)');
  config.addPassthroughCopy('src/_redirects');

  config.addGlobalData('meta', {
    title: pkg.title,
    description: pkg.description,
    homepage: pkg.homepage,
  });

  config.addFilter('siteUrl', (content) => {
    return new URL(content, pkg.homepage).href;
  });

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  config.addCollection('posts', (collection) => {
    return getPosts(collection.getAll());
  });

  config.addTransform('html', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return transformHtml(content, isProd);
    }

    return content;
  });

  if (isProd) {
    config.addCollection('__build', async (collection) => {
      const items = getAllPages(collection.getAll());
      await sitemapAndRss(items);
      return [];
    });

    config.on('eleventy.after', async () => {
      await Promise.all([vendorScript(), vendorStyles()]);
    });
  }

  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: '_includes',
      layouts: '_layouts',
      // data: 'data',
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
