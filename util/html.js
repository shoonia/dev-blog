const xss = require('xss');
const { minify } = require('html-minifier');

const minifyOptions = {
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
  onIgnoreTagAttr(tag, name, value) {
    if (name !== 'class') {
      return '';
    }

    return `${name}="${xss.escapeAttrValue(value)}"`;
  },

  onTag(tag, html) {
    if (tag === 'a') {
      const a = html.slice(0, -1);
      return `${a} target="_blank" rel="noopener noreferrer">`;
    }

    return html;
  },
};

module.exports = {
  minify: (html) => minify(html, minifyOptions),
  xss: (html) => xss(html, xssOtions),
};
