/* eslint-disable no-return-await */
const { createInterface } = require('readline');
const { createReadStream, createWriteStream } = require('fs');
const { getFilesInfo } = require('./utils');

async function defineUnique(line, store) {
  if (line === '[' || line === ']') return;
  if (line[line.length - 1] === ',') line = line.slice(0, -1);
  const product = await JSON.parse(line);
  let str = Object.entries(product);
  str.splice(2, 1);
  str = str.toString();
  if (store[str]) store[str].quantity += product.quantity;
  else store[str] = product;
}

function optimization(pathToFile, callback) {
  const uniqueProduct = {};

  const fileStream = createReadStream(pathToFile);

  fileStream.on('error', (e) => {
    console.log(e.message);
    callback(e);
  });

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('line', async (line) => {
    await defineUnique(line, uniqueProduct);
  }).on('close', () => {
    callback(null, uniqueProduct);
  });
}

function initializeAutomaticOptimization(path, time) {
  return setInterval(async () => {
    let files = await getFilesInfo(path);
    const optimizedFiles = await getFilesInfo(`${path}/optimized`);
    optimizedFiles.forEach((optFile) => {
      files = files.filter((file) => file.filename !== optFile.filename);
    });
    files.forEach((file) =>
      optimization(`${path}/${file.filename}`, (e, uniqueProduct) => {
        if (e) return console.log(e.message);
        const productsOptimized = Object.values(uniqueProduct);
        const writableStream = createWriteStream(`./upload/optimized/${file.filename}`);
        writableStream.write(JSON.stringify(productsOptimized));
      }),
    );
  }, time);
}
module.exports = { defineUnique, optimization, initializeAutomaticOptimization };
