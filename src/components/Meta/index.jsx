import React from 'react';
import Helmet from 'react-helmet';
import T from 'prop-types';

function Meta({ data }) {
  const {
    // path,
    title,
    description,
    // author,
    // date,
    lang,
    image,
    url,
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
      content: 'website',
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      name: 'twitter:card',
      content: 'summary',
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
  ];

  return (
    <Helmet
      title={title}
      titleTemplate="%s | Blog"
      meta={metaData}
    >
      <html lang={lang} />
    </Helmet>
  );
}

Meta.propTypes = {
  data: T.shape({
    // path: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    // author: T.string.isRequired,
    // date: T.string.isRequired,
    lang: T.string.isRequired,
    image: T.string.isRequired,
    url: T.string.isRequired,
  }).isRequired,
};

export default Meta;
