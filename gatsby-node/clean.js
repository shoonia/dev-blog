const { realpathSync, promises } = require('fs');
const { resolve, extname } = require('path');

const root = realpathSync(process.cwd());

const resolvePath = (...paths) => resolve(root, 'public', ...paths);

const rmAsync = (path) => promises.rm(
  resolvePath(path),
  { recursive: true },
);

exports.clean = async () => {
  const files = await promises.readdir(resolvePath());

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
