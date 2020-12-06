const { readdir, stat } = require('fs').promises;

async function getFilesInfo(path) {
  let files = await readdir(path);
  files = files.filter((file) => file.split('.').length >= 2);
  files = files.map(async (file) => {
    const { size, birthtime } = await stat(`${path}/${file}`);
    return { filename: file, size, birthtime };
  });
  return Promise.all(files);
}

module.exports = { getFilesInfo };
