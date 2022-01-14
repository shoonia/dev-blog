const map = (i) => i.data;
const sort = (a, b) => new Date(b.date) - new Date(a.date);

exports.getPosts = (items) => {
  return items
    .filter((i) => i.data.layout === 'posts.njk')
    .map(map)
    .sort(sort);
};

exports.getAllPages = (items) => {
  return items
    .filter((i) => i.data.layout !== 'empty.njk')
    .map(map)
    .sort(sort);
};
