const { resolve } = require('path');
const { writeFile } = require('fs').promises;
const { Feed } = require('feed');

const pkg = require('../package.json');

exports.rss = async ({ graphql }) => {
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
          image
        }
      }
    }
  }`);

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

  nodes.forEach(({ frontmatter }) => {
    const url = createUrl(frontmatter.path);

    feed.addItem({
      id: url,
      link: url,
      title: frontmatter.title,
      description: frontmatter.description,
      content: frontmatter.description,
      date: new Date(frontmatter.date),
      image: frontmatter.image,
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

  await writeFile(
    resolve(process.cwd(), 'public/rss.xml'),
    feed.rss2(),
  );
};
