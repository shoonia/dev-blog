import React from 'react';
import { Helmet } from 'react-helmet';
import T from 'prop-types';

function Meta({ data }) {
  const {
    // path,
    title,
    description,
    author,
    date,
    modified,
    lang,
    image,
    url,
    template,
    // siteUrl,
  } = data;

  const siteName = 'Alexander Zaytsev | Web Development Blog';

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
    modified && ({
      property: 'article:modified_time',
      content: modified,
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
      property: 'og:site_name',
      content: siteName,
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
  ]
    .filter(Boolean);

  const JSONLD = (template === 'default') && (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        name: siteName,
        headline: title,
        description,
        inLanguage: lang,
        url,
        datePublished: date,
        dateModified: modified,
        author: {
          '@type': 'Person',
          name: author,
        },
        image: {
          '@type': 'ImageObject',
          url: image,
        },
        mainEntityOfPage: {
          '@type': 'itemPage',
          '@id': url,
          url,
        },
      })}
    </script>
  );

  return (
    <Helmet
      title={title}
      titleTemplate="%s | Web Development Blog"
      meta={metaData}
    >
      <html lang={lang} />
      <link rel="canonical" href={url} />
      {JSONLD}
    </Helmet>
  );
}

Meta.propTypes = {
  data: T.shape({
    // path: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    author: T.string.isRequired,
    date: T.string,
    modified: T.string,
    lang: T.string.isRequired,
    image: T.string,
    url: T.string.isRequired,
    template: T.string,
    // siteUrl: T.string,
  }).isRequired,
};

export default Meta;
