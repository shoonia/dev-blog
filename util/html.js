const { readFileSync } = require('fs');
const xss = require('xss');
const htmlMinifier = require('html-minifier');
const tarser = require('terser');

const htmlInifierOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyURLs: true,
};

const xssOtions = {
  onTag(tag, html) {
    if (tag === 'a' && !html.startsWith('</')) {
      const a = html.slice(0, -1);

      return `${a} target="_blank" rel="noopener noreferrer">`;
    }

    return html;
  },
};

const tarserOptions = {
  ecma: 8,
  module: true,
  toplevel: true,
  parse: {
    ecma: 8,
  },
  compress: {
    ecma: 8,
    module: true,
    toplevel: true,
    warnings: false,
    comparisons: false,
    inline: 2,
    drop_console: true,
    passes: 3,
  },
  output: {
    ecma: 8,
    comments: false,
  },
};

module.exports = {
  minifyHTML: (html) => htmlMinifier.minify(html, htmlInifierOptions),
  xss: (html) => xss(html, xssOtions),
  minifyJS: (path) => tarser.minify(readFileSync(path, 'utf8'), tarserOptions).code,
};
