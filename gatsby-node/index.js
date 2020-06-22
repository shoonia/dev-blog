const posts = require('./posts');

exports.createPages = async (gatsby) => {
  await posts(gatsby);
};
