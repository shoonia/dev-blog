import React from 'react';
import { Helmet } from 'react-helmet';
import T from 'prop-types';

function Meta({ data }) {
  const {
    // path,
    title,
    description,
    // author,
    date,
    lang,
    image,
    url,
    template,
  } = data;

  const metaData = [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'article',
    },
    date && ({
      property: 'article:published_time',
      content: date,
    }),
    {
      property: 'og:url',
      content: url,
    },
    image && ({
      property: 'og:image',
      content: image,
    }),
    {
      name: 'twitter:card',
      content: (template === 'snippet') ? 'summary_large_image' : 'summary',
    },
    {
      name: 'twitter:site',
      content: '@_shoonia',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'google-site-verification',
      content: 'r9IQYersVVRdg00VhqCTt8yTNmuCdgC-fLFsTiCrk4M',
    },
    {
      name: 'theme-color',
      content: '#fff',
    },
  ]
    .filter(Boolean);

  return (
    <Helmet
      title={title}
      titleTemplate="%s | Blog"
      meta={metaData}
    >
      <html lang={lang} />
      <link
        rel="canonical"
        href={url}
      />
      <link
        rel="preconnect"
        href="https://static.wixstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,700&display=swap&subset=cyrillic"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
}

Meta.propTypes = {
  data: T.shape({
    // path: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    // author: T.string.isRequired,
    date: T.string,
    lang: T.string.isRequired,
    image: T.string,
    url: T.string.isRequired,
    template: T.string,
  }).isRequired,
};

export default Meta;
