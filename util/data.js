import { siteUrl, isAbsoluteUrl } from './halpers.js';

export const authorName = (data) => {
  return data.author?.name || data.pkg.author.name;
};

export const image = (data) => {
  return isAbsoluteUrl(data.image) ? data.image : siteUrl(data.image);
};

export const jsonLd = (data) => {
  const url = siteUrl(data.permalink);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: data.title,
    headline: data.title,
    description: data.description || data.pkg.description,
    inLanguage: data.lang,
    url,
    datePublished: data.date,
    dateModified: data.modified || undefined,
    author: {
      '@type': 'Person',
      name: authorName(data),
      url: data.author?.url || data.pkg.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.pkg.author.name,
      email: data.pkg.author.email,
      sameAs: data.pkg.author.url,
      logo: {
        '@type': 'ImageObject',
        url: siteUrl('assets/icons/icon-512x512.png'),
      },
    },
    image: {
      '@type': 'ImageObject',
      url: image(data),
    },
    mainEntityOfPage: {
      '@type': 'itemPage',
      '@id': url,
      url,
    },
  });
};
