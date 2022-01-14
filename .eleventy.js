const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const { transformHtml } = require('./util/html');
const pkg = require('./package.json');

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
    return collection.getAll()
      .filter((i) => i.data.layout === 'posts.njk')
      .map((i) => i.data)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  config.addTransform('html', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return transformHtml(content);
    }

    return content;
  });

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
