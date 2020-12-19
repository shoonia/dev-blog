const { minify } = require('html-minifier');

const htmlInifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyElements: true,
};

module.exports = {
  minifyHTML: (html) => {
    const mini = minify(html, htmlInifierOptions);

    return mini
      .replace(/ style="outline:none" tabindex="-1" id="gatsby-focus-wrapper"/, '')
      .replace(/ class="gatsby-highlight"/g, '')
      .replace(/\bclass="token ([a-z]+)"/g, 'class="$1"');
  },
};
