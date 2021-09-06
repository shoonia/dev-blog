const { realpathSync, promises } = require('fs');
const { resolve } = require('path');

const root = realpathSync(process.cwd());

const rmAsync = (path) => promises.rm(
  resolve(root, path),
  { recursive: true },
);

exports.clean = async () => {
  await Promise.all([
    rmAsync('public/page-data'),
    rmAsync('public/static'),
  ]);
};
