const { writeFile } = require('node:fs/promises');
const { SitemapStream, streamToPromise } = require('sitemap');

const { rootResolve, siteUrl } = require('./halpers');
const { dateNow } = require('./env');
const pkg = require('../package.json');

exports.creaeSitemap = async (nodes) => {
  const sitemapStream = new SitemapStream();

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

  nodes.forEach((i) => {
    sitemapStream.write({
      url: siteUrl(i.permalink),
      lastmod: i.modified,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  sitemapStream.end();

  const buffer = await streamToPromise(sitemapStream);

  await writeFile(
    rootResolve('public/sitemap.xml'),
    buffer,
    'binary',
  );
};
