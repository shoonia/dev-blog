import { image, authorName, jsonLd } from '../../util/data.js';
import { Kind } from '../../util/filters.js';

export default {
  layout: 'posts.njk',
  kind: Kind.snippet,
  eleventyComputed: {
    permalink: (data) => data.page.filePathStem + '/',
    image,
    authorName,
    jsonLd,
  },
};
