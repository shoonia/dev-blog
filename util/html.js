const { minify } = require('html-minifier-terser');

const htmlInifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeEmptyElements: true,
  minifyJS: true,
  minifyCSS: true,
};

module.exports = {
  async minifyHTML(html) {
    const mini = await minify(html, htmlInifierOptions);

    return mini
      .replace(/ style="outline:(none|0)" tabindex="-1" id="gatsby-focus-wrapper"/, '')
      .replace(/ class="gatsby-highlight"/g, '')
      .replace(/\bclass="token ([a-z- ]+)"/g, 'class="$1"');
  },
};
