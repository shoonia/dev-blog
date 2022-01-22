const { siteUrl } = require('../../util/halpers');

const getAutorName = (data) => typeof data.author?.name === 'string' ? data.author.name : data.pkg.author.name;

module.exports = {
  layout: 'posts.njk',
  eleventyComputed: {
    image: (data) => {
      return data.image.startsWith('https://') ? data.image : siteUrl(data.image);
    },

    authorName: (data) => getAutorName(data),

    jsonLd: (data) => {
      const url = siteUrl(data.permalink);
      const autorName = getAutorName(data);

      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        name: data.title,
        headline: data.title,
        description: data.description ?? data.pkg.description,
        inLanguage: data.lang,
        url,
        datePublished: data.date,
        dateModified: data.modified || undefined,
        author: {
          '@type': 'Person',
          name: autorName,
          url: autorName === data.pkg.author.name ? data.pkg.author.url : data.author?.url,
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
          url: data.image.startsWith('https://') ? data.image : siteUrl(data.image),
        },
        mainEntityOfPage: {
          '@type': 'itemPage',
          '@id': url,
          url,
        },
      });
    },
  },
};
