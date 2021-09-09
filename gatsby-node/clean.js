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

  const removeFiles = files
    .map((file) => {
      if (extname(file) === '.js') {
        return rmAsync(file);
      }

      return false;
    })
    .filter(Boolean);

  await Promise.all([
    rmAsync('page-data'),
    rmAsync('static'),
    ...removeFiles,
  ]);
};
