const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { transformHtml } = require('./util/html');

console.log(process.env.NODE_ENV)

module.exports = (config) => {
  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/*.!(md)');
  config.addPassthroughCopy('src/_redirects')

  config.addPlugin(syntaxHighlight, {
    lineSeparator: '\n',
  });

  config.addTransform('html', async (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return transformHtml(content);
    }

    return content;
  })

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
