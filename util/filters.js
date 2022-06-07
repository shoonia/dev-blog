exports.getPosts = (items) => {
  return items
    .filter((i) => i.data.layout === 'posts.njk')
    .map((i) => i.data)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};
