import React from 'react';
import T from 'prop-types';

function HTML({
  htmlAttributes,
  headComponents,
  postBodyComponents,
  body,
}) {
  if (process.env.NODE_ENV === 'production') {
    return (
      <html lang={htmlAttributes.lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no" />
          {headComponents}
        </head>
        <body
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </html>
    );
  }

  // development
  return (
    <html lang={htmlAttributes.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no" />
        {headComponents}
      </head>
      <body>
        <div id="___gatsby">
          <div
            id="gatsby-focus-wrapper"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: body }}
          />
          <div id="gatsby-announcer" />
        </div>
        {postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: T.shape({
    lang: T.string.isRequired,
  }).isRequired,
  headComponents: T.arrayOf(T.node).isRequired,
  body: T.string.isRequired,
  postBodyComponents: T.arrayOf(T.node).isRequired,
  // bodyAttributes: T.object,
  // preBodyComponents: T.array,
};

export default HTML;