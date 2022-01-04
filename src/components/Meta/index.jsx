import { Helmet } from 'react-helmet';
import { Parser } from 'html-to-react';
import T from 'prop-types';

import {
  title as metaTitle,
  author as metaAuthor,
  createUrl,
} from '../../../util/meta';

const htmlToReact = new Parser();

const Meta = ({ data }) => {
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
    head,
  } = data;

  const headers = typeof head === 'string' && htmlToReact.parse(head);

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
    date && {
      property: 'article:published_time',
      content: date,
    },
    modified && {
      property: 'article:modified_time',
      content: modified,
    },
    {
      property: 'og:url',
      content: url,
    },
    image && {
      property: 'og:image',
      content: image,
    },
    {
      property: 'og:site_name',
      content: metaTitle,
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
      itemprop: 'name',
      content: title,
    },
    {
      itemprop: 'description',
      content: description,
    },
    image && {
      itemprop: 'image',
      content: image,
    },
  ].filter(Boolean);

  const JSONLD = (template === 'default') && (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        name: metaTitle,
        headline: title,
        description,
        inLanguage: lang,
        url,
        datePublished: date,
        dateModified: modified || undefined,
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: metaAuthor.name,
          email: metaAuthor.email,
          sameAs: metaAuthor.url,
          logo: {
            '@type': 'ImageObject',
            url: createUrl('icons/icon-512x512.png'),
          },
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
      {headers}
      {JSONLD}
    </Helmet>
  );
};

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
    head: T.string,
  }).isRequired,
};

export default Meta;
