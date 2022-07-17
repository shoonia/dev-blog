const { image, authorName, jsonLd } = require('../../util/data');
const { Kind } = require('../../util/filters');

module.exports = {
  layout: 'posts.njk',
  kind: Kind.snippet,
  eleventyComputed: {
    permalink: (data) => data.page.filePathStem + '/',
    image,
    authorName,
    jsonLd,
  },
};
