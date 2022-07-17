const Kind = {
  posts: 'posts',
  snippet: 'snippet',
};

const sort = (a, b) => Date.parse(b.date) - Date.parse(a.date);
const map = (i) => i.data;

module.exports = {
  Kind,
  getPosts: (items) => {
    return items
      .filter((i) => i.data.kind === Kind.posts)
      .map(map)
      .sort(sort);
  },
};
