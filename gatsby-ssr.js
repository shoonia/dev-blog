const { renderToString } = require('react-dom/server');
const { minifyHTML } = require('./util/html');

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = minifyHTML(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};
