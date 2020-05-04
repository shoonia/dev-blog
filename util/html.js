const { readFileSync } = require('fs');
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
  minifyURLs: true,
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
  minifyJS: (path) => tarser.minify(readFileSync(path, 'utf8'), tarserOptions).code,
};
