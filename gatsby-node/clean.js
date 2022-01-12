const { rm, readdir } = require('fs/promises');
const { extname } = require('path');

const { rootResolve } = require('../util/paths');
const { isCI } = require('../util/meta');

exports.clean = async () => {
  if (isCI) {
    const files = await readdir(rootResolve('public'));

    const removeFiles = files.filter(
      (file) => extname(file) === '.js',
    );

    const removeList = [
      'page-data',
      'webpack.stats.json',
      'chunk-map.json',
    ];

    await Promise.all(
      [
        ...removeList,
        ...removeFiles,
      ].map((path) => rm(
        rootResolve('public', path),
        { recursive: true },
      )),
    );
  }
};
