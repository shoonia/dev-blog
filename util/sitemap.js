import { writeFile } from 'node:fs/promises';
import { SitemapStream, streamToPromise } from 'sitemap';

import { rootResolve, siteUrl } from './halpers.js';
import { dateNow, pkg } from './env.js';

export const createSitemap = async (nodes) => {
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

  sitemapStream.write({
    url: siteUrl('/snippets/'),
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
