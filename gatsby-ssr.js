const { renderToString } = require('react-dom/server');
const { minifyHTML } = require('./util/html');

exports.replaceRenderer = async ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = await minifyHTML(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};
