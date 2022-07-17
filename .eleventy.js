const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { transformHtml } = require('./util/html');
const { creaeSitemap } = require('./util/sitemap');
const { createRss } = require('./util/rss');
const { getPosts } = require('./util/filters');
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

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  config.addCollection('posts', async (collection) => {
    const posts = getPosts(collection.getAll());

    if (isProd) {
      await Promise.all([
        creaeSitemap(posts),
        createRss(posts)
      ]);
    }

    return posts;
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
