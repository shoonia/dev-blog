import { image, authorName, jsonLd } from '../../util/data.js';
import { Kind } from '../../util/filters.js';

export default {
  layout: 'posts.njk',
  kind: Kind.posts,
  eleventyComputed: {
    image,
    authorName,
    jsonLd,
  },
};
