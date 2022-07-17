const { image, authorName, jsonLd } = require('../../util/data');

module.exports = {
  layout: 'posts.njk',
  eleventyComputed: {
    image,
    authorName,
    jsonLd,
  },
};
