const { promises } = require('fs');
const { extname } = require('path');

const { rootResolve } = require('../util/paths');

const rmAsync = (path) => promises.rm(
  rootResolve('public', path),
  { recursive: true },
);

exports.clean = async () => {
  const files = await promises.readdir(rootResolve('public'));

  const removeFiles = files.filter(
    (file) => extname(file) === '.js',
  );

  const removeList = [
    'page-data',
    'static',
    'webpack.stats.json',
    'chunk-map.json',
  ];

  await Promise.all(
    [
      ...removeList,
      ...removeFiles,
    ].map((path) => rmAsync(path)),
  );
};
