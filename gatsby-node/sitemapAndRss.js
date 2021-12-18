const { writeFile } = require('fs/promises');
const { Feed } = require('feed');
const { SitemapStream, streamToPromise } = require('sitemap');

const { rootResolve } = require('../util/paths');
const {
  title,
  description,
  author: metaAuthor,
  homepage,
  createUrl,
} = require('../util/meta');

exports.sitemapAndRss = async ({ graphql }) => {
  const {
    data: {
      allMarkdownRemark: {
        nodes,
      },
    },
  } = await graphql(`
  {
    allMarkdownRemark(
      sort: {
        fields: [frontmatter___date]
        order: DESC
      }
      filter: {
        frontmatter: {
          publish: {
            eq: true
          }
          template: {
            eq: "default"
          }
        }
      }
    ) {
      nodes {
        frontmatter {
          title
          description
          path
          date
          modified
          image
        }
      }
    }
  }`);

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
    image: createUrl('icons/icon-256x256.png'),
    favicon: createUrl('favicon-32x32.png'),
    // copyright: 'All rights reserved 2013, John Doe',
    feedLinks: {
      json: createUrl('rss.json'),
      atom: createUrl('rss.xml'),
    },
  });

  nodes.forEach(({ frontmatter: i }) => {
    const url = createUrl(i.path);

    sitemapStream.write({
      url,
      lastmod: i.modified,
      changefreq: 'weekly',
      priority: 0.8,
    });

    feed.addItem({
      id: url,
      link: url,
      title: i.title,
      description: i.description,
      content: i.description,
      date: new Date(i.date),
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
      feed.atom1(),
    ),
    writeFile(
      rootResolve('public/rss.json'),
      feed.json1(),
    ),
  ]);
};
