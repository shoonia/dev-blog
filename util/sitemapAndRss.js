const { writeFile } = require('node:fs/promises');
const { Feed } = require('feed');
const { SitemapStream, streamToPromise } = require('sitemap');
const { minify } = require('minify-xml');

const { rootResolve, siteUrl } = require('./halpers');
const { dateNow } = require('./env');
const pkg = require('../package.json');

exports.sitemapAndRss = async (nodes) => {
  const sitemapStream = new SitemapStream();

  const author = {
    name: pkg.author.name,
    email: pkg.author.email,
    link: pkg.author.url,
  };

  sitemapStream.write({
    url: pkg.homepage,
    lastmod: dateNow,
    changefreq: 'weekly',
    priority: 1,
  });

  sitemapStream.write({
    url: siteUrl('/support-ukraine/'),
    lastmod: dateNow,
    changefreq: 'weekly',
    priority: 0.8,
  });

  const feed = new Feed({
    title: pkg.title,
    description: pkg.description,
    id: pkg.homepage,
    link: pkg.homepage,
    language: 'en',
    updated: dateNow,
    // generator: '',
    copyright: `© ${pkg.author.name}, 2019—${dateNow.getFullYear()}`,
    author,
    image: siteUrl('/assets/icons/icon-256x256.png'),
    favicon: siteUrl('favicon-32x32.png'),
    feedLinks: {
      json: siteUrl('rss.json'),
      atom: siteUrl('rss.xml'),
    },
  });

  nodes.forEach((i) => {
    const url = siteUrl(i.permalink);

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
        rootResolve('public/sitemap.xml'),
        buffer,
        'binary',
      ),
    ),
    writeFile(
      rootResolve('public/rss.xml'),
      minify(feed.atom1()),
    ),
    writeFile(
      rootResolve('public/rss.json'),
      JSON.stringify(JSON.parse(feed.json1())),
    ),
  ]);
};
