const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = (config) => {
  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/*.!(md)');
  config.addPassthroughCopy('src/_redirects')

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  return {
    dir: {
      input: 'src',
      output: 'public',
      // includes: 'includes',
      // layouts: 'layouts',
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
