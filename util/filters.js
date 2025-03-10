export const Kind = {
  posts: 'posts',
  snippet: 'snippet',
};

const sort = (a, b) => Date.parse(b.date) - Date.parse(a.date);
const map = (i) => i.data;

export const getPosts = (items) =>
  items
    .filter((i) => i.data.kind === Kind.posts)
    .map(map)
    .sort(sort);

export const getSnippets = (items) =>
  items
    .filter((i) => i.data.kind === Kind.snippet)
    .map(map)
    .sort(sort);
