const posts = require('./posts');
const { sitemapAndRss } = require('./sitemapAndRss');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};

exports.onPostBuild = async (...args) => {
  await sitemapAndRss(...args);
};
