import React from 'react';
import T from 'prop-types';

import pkg from '../package.json';

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = isProd ? pkg.homepage : 'http://localhost:8000';
const siteName = `${pkg.author.name} | ${pkg.description}`;

const links = (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no" />
    <base href={baseUrl} />
    <link
      rel="preload"
      href="/firacode@5.2.0/FiraCode-Regular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
    <link rel="webmention" href="https://webmention.io/shoonia.site/webmention" />
    <link rel="pingback" href="https://webmention.io/shoonia.site/xmlrpc" />
    <link
      rel="alternate"
      href={`${pkg.homepage}/rss.xml`}
      type="application/rss+xml"
      title={siteName}
    />
    <link
      rel="alternate"
      href={`${pkg.homepage}/rss.json`}
      type="application/json"
      title={siteName}
    />
    <link
      rel="sitemap"
      href="/sitemap.xml"
      type="application/xml"
      title={siteName}
    />
  </>
);

function HTML({
  htmlAttributes,
  headComponents,
  postBodyComponents,
  body,
}) {
  // PRODUCTION
  if (isProd) {
    return (
      <html lang={htmlAttributes.lang}>
        <head>
          {links}
          {headComponents}
        </head>
        <body
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: body }}
        />
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
