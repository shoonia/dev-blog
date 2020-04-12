const { readFileSync } = require('fs');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { minify: minifyJs } = require('terser');

const { minify } = require('./util/html.js');

const { code } = minifyJs(readFileSync('./util/ga.js', 'utf8'));

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = minify(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    createElement('script', {
      dangerouslySetInnerHTML: { __html: code },
    }),
  ]);
};
