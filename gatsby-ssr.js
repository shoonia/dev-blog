const { renderToString } = require('react-dom/server');
const { transformHtml } = require('./util/html');

exports.replaceRenderer = async ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = await transformHtml(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};
