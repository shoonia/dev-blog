const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { minifyHTML, minifyJS } = require('./util/html.js');

const code = minifyJS('./util/ga.js');
const isProduction = process.env.NODE_ENV === 'production';

exports.onRenderBody = ({ setPostBodyComponents }) => {
  if (isProduction) {
    setPostBodyComponents([
      createElement('script', {
        async: true,
        id: 'ga-lite',
        src: 'https://static.parastorage.com/unpkg/ga-lite@2.0.5/dist/ga-lite.min.js',
        crossOrigin: 'anonymous',
      }),
      createElement('script', {
        dangerouslySetInnerHTML: { __html: code },
      }),
    ]);
  }
};

exports.replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const bodyHTML = renderToString(bodyComponent);
  const miniHTML = minifyHTML(bodyHTML);

  replaceBodyHTMLString(miniHTML);
};
