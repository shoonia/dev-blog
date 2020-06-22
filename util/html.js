const htmlMinifier = require('html-minifier');

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

module.exports = {
  minifyHTML: (html) => htmlMinifier.minify(html, htmlInifierOptions),
};
