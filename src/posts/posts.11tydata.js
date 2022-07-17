const { image, authorName, jsonLd } = require('../../util/data');
const { Kind } = require('../../util/filters');

module.exports = {
  layout: 'posts.njk',
  kind: Kind.posts,
  eleventyComputed: {
    image,
    authorName,
    jsonLd,
  },
};
