const { writeFile } = require('fs/promises');
const { Feed } = require('feed');
const { SitemapStream, streamToPromise } = require('sitemap');

const { resolve } = require('./resolve');
const {
  title,
  description,
  author: metaAuthor,
  homepage,
} = require('../package.json');

const createUrl = (path) => new URL(path, homepage).href;

exports.sitemapAndRss = async (nodes) => {
  const dateNow = new Date();
  const sitemapStream = new SitemapStream();

  const author = {
    name: metaAuthor.name,
    email: metaAuthor.email,
    link: metaAuthor.url,
  };

  sitemapStream.write({
    url: homepage,
    lastmod: dateNow,
    changefreq: 'weekly',
    priority: 1,
  });

  const feed = new Feed({
    title,
    description,
    id: homepage,
    link: homepage,
    language: 'en',
    updated: dateNow,
    // generator: '',
    author,
    image: createUrl('/assets/icons/icon-256x256.png'),
    favicon: createUrl('favicon-32x32.png'),
    feedLinks: {
      json: createUrl('rss.json'),
      atom: createUrl('rss.xml'),
    },
  });

  nodes.forEach((i) => {
    const url = createUrl(i.permalink);

    sitemapStream.write({
      url,
      lastmod: i.modified,
      changefreq: 'weekly',
      priority: 0.8,
    });

    feed.addItem({
      id: url,
      link: url,
      title: i.title ?? '',
      description: i.description,
      content: i.description,
      date: new Date(i.modified),
      published: new Date(i.date),
      image: i.image,
      author: [
        author,
      ],
      // contributor: [],
    });
  });

  sitemapStream.end();

  await Promise.all([
    streamToPromise(sitemapStream).then(
      (buffer) => writeFile(
        resolve('public/sitemap.xml'),
        buffer,
        'binary',
      ),
    ),
    writeFile(
      resolve('public/rss.xml'),
      feed.atom1(),
    ),
    writeFile(
      resolve('public/rss.json'),
      JSON.stringify(JSON.parse(feed.json1())),
    ),
  ]);
};
