const posts = require('./posts');
const { rss } = require('./rss');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};

exports.onPostBuild = async (...args) => {
  await rss(...args);
};
