import T from 'prop-types';

import { title, createUrl, isProd } from '../util/meta';

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  body,
  postBodyComponents,
}) => (
  <html {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <link
        rel="preload"
        href="/firacode@5.2.0/FiraCode-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="webmention"
        href="https://webmention.io/shoonia.site/webmention"
      />
      <link
        rel="pingback"
        href="https://webmention.io/shoonia.site/xmlrpc"
      />
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
      {headComponents}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: 'import("/quicklink@2.2.0/quicklink.mjs").then(i=>i.listen({ignores:[i=>i.indexOf("#")>-1]}))',
        }}
      />
    </head>
    {isProd
      ? <body dangerouslySetInnerHTML={{ __html: body }} />
      : (
        <body {...bodyAttributes}>
          <div
            key={'body'}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {postBodyComponents}
        </body>
      )}
  </html>
);

HTML.propTypes = {
  htmlAttributes: T.object,
  headComponents: T.array,
  bodyAttributes: T.object,
  preBodyComponents: T.array,
  body: T.string,
  postBodyComponents: T.array,
};

export { HTML as default };
