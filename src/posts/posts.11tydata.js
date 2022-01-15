module.exports = {
  layout: 'posts.njk',
  eleventyComputed: {
    jsonLd: (data) => {
      const url = new URL(data.permalink, data.pkg.homepage).href;

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
          name: data.author,
          url: data.author === data.pkg.author.name ? data.pkg.author.url : undefined,
        },
        publisher: {
          '@type': 'Organization',
          name: data.pkg.author.name,
          email: data.pkg.author.email,
          sameAs: data.pkg.author.url,
          logo: {
            '@type': 'ImageObject',
            url: new URL('assets/icons/icon-512x512.png', data.pkg.homepage),
          },
        },
        image: {
          '@type': 'ImageObject',
          url: data.image,
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
