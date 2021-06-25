const { resolve } = require('path');
const { writeFile } = require('fs').promises;
const { Feed } = require('feed');
const { Sitemap } = require('sitemap');

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

  const root = process.cwd();

  const sitemap = new Sitemap([], pkg.homepage);

  const feed = new Feed({
    title: pkg.title,
    description: pkg.description,
    id: pkg.homepage,
    link: pkg.homepage,
    language: 'en',
    updated: new Date(),
    generator: 'generator',
    author: {
      name: pkg.author.name,
      email: pkg.author.email,
      link: pkg.author.url,
    },
    // image: 'http://example.com/image.png',
    // favicon: 'http://example.com/favicon.ico',
    // copyright: 'All rights reserved 2013, John Doe',
    // feedLinks: {
    //   json: 'https://example.com/json',
    //   atom: 'https://example.com/atom',
    // },
  });

  const createUrl = (pth) => new URL(pth, pkg.homepage).href;

  nodes.forEach(({ frontmatter: i }) => {
    const url = createUrl(i.path);

    sitemap.add({
      url,
      lastmodISO: i.modified,
      changefreq: 'weekly',
      priority: 0.7,
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

  await Promise.all([
    writeFile(
      resolve(root, 'public/sitemap.xml'),
      sitemap.toXML(),
    ),
    writeFile(
      resolve(root, 'public/rss.xml'),
      feed.rss2(),
    ),
  ]);
};
