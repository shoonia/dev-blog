const { renderToString } = require('react-dom/server');
const { minify } = require('./util/html.js');

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = minify(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};
