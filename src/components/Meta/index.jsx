import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

function Meta({ data }) {
  const {
    // path,
    title,
    description,
    // author,
    // date,
    lang,
    image,
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
    // {
    //   property: 'og:url', // TODO
    //   content: url
    // },
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
  data: PropTypes.shape({
    // path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    // author: PropTypes.string.isRequired,
    // date: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default Meta;
