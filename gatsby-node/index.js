const posts = require('./posts');
const { sitemapAndRss } = require('./sitemapAndRss');
const { clean } = require('./clean');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};

exports.onPostBuild = async (...args) => {
  await Promise.all([
    sitemapAndRss(...args),
    clean(),
  ]);
};
