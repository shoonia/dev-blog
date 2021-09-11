const { writeFile } = require('fs').promises;
const { Feed } = require('feed');
const { SitemapStream, streamToPromise } = require('sitemap');

const { rootResolve } = require('../util/paths');
const { createUrl } = require('../util/meta');

const pkg = require('../package.json');

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
  const sitemap = new SitemapStream();

  sitemap.write({
    url: pkg.homepage,
    lastmod: dateNow,
    changefreq: 'weekly',
    priority: 1,
  });

  const feed = new Feed({
    title: pkg.title,
    description: pkg.description,
    id: pkg.homepage,
    link: pkg.homepage,
    language: 'en',
    updated: dateNow,
    generator: 'generator',
    author: {
      name: pkg.author.name,
      email: pkg.author.email,
      link: pkg.author.url,
    },
    image: 'https://shoonia.site/icon-256x256.png',
    favicon: 'https://shoonia.site/favicon-32x32.png',
    // copyright: 'All rights reserved 2013, John Doe',
    feedLinks: {
      json: createUrl('rss.json'),
      atom: createUrl('rss.xml'),
    },
  });

  nodes.forEach(({ frontmatter: i }) => {
    const url = createUrl(i.path);

    sitemap.write({
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
        {
          name: pkg.author.name,
          email: pkg.author.email,
          link: pkg.author.url,
        },
      ],
      // contributor: [],
    });
  });

  sitemap.end();

  await Promise.all([
    streamToPromise(sitemap).then(
      (buffer) => writeFile(
        rootResolve('public/sitemap.xml'),
        buffer.toString('utf8'),
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
