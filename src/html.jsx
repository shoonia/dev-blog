import React from 'react';
import T from 'prop-types';

function HTML({
  htmlAttributes,
  headComponents,
  postBodyComponents,
  body,
}) {
  const links = (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no" />
      <link
        rel="preconnect"
        href="https://static.wixstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="https://static.parastorage.com/unpkg/firacode@5.2.0/distr/woff2/FiraCode-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="webmention" href="https://webmention.io/shoonia.site/webmention" />
      <link rel="pingback" href="https://webmention.io/shoonia.site/xmlrpc" />
    </>
  );

  const firacode = (
    <link
      rel="stylesheet"
      href="https://static.parastorage.com/unpkg/firacode@5.2.0/distr/fira_code.css"
      crossOrigin="anonymous"
    />
  );

  // PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    return (
      <html lang={htmlAttributes.lang}>
        <head>
          {links}
          {headComponents}
        </head>
        <body>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {firacode}
        </body>
      </html>
    );
  }

  // DEVELOPMENT
  return (
    <html lang={htmlAttributes.lang}>
      <head>
        {links}
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
        {firacode}
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
