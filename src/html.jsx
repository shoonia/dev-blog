import T from 'prop-types';

import { title, homepage, createUrl, isProd } from '../util/meta';

const links = (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no" />
    <base href={homepage} />
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
      href={createUrl('rss.xml')}
      type="application/rss+xml"
      title={title}
    />
    <link
      rel="alternate"
      href={createUrl('rss.json')}
      type="application/json"
      title={title}
    />
    <link
      rel="sitemap"
      href="/sitemap.xml"
      type="application/xml"
      title={title}
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
