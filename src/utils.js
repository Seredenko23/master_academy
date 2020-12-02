/* eslint-disable no-restricted-globals */
const { promisify } = require('util');
const { pipeline, Transform } = require('stream');
const { readdir, stat } = require('fs').promises;

const promisifiedPipeline = promisify(pipeline);

Array.prototype.myMap = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) newArr.push(callback(this[i], i, this));
  return newArr;
};

function defineAmountOfSales(product) {
  const { type, color } = product;
  switch (true) {
    case type === 'hat' && color === 'red':
      return 3;
    case type === 'hat':
      return 2;
    default:
      return 1;
  }
}

function repeatPromiseUntilResolved(func) {
  return func()
    .then((res) => res)
    .catch(() => repeatPromiseUntilResolved(func));
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateJsonStr(arr, keys) {
  return arr.reduce((acc, red) => {
    let jsonStr = red
      .split(',')
      .map(
        (value, ind) =>
          `"${keys[ind]}": ${
            !isNaN(+value) || value === 'true' || value === 'false' ? value : `"${value}"`
          }`,
      );
    jsonStr = `,\n\t{${jsonStr}}`;
    return acc + jsonStr;
  }, '');
}

function transformCsvToJson() {
  let isFirst = true;
  let lastEL = '';
  let keys = [];

  const transform = (chunk, encoding, callback) => {
    const csvArray = chunk.toString().split('\n');
    csvArray[0] = lastEL + csvArray[0];
    lastEL = csvArray.pop();

    if (isFirst) {
      isFirst = !isFirst;
      keys = csvArray.shift().split(',');
      const str = generateJsonStr(csvArray, keys);
      callback(null, `[${str.slice(1)}`);
      return;
    }

    const str = generateJsonStr(csvArray, keys);
    callback(null, str);
  };

  const flush = (callback) => {
    callback(null, '\n]');
  };

  return new Transform({ transform, flush });
}

async function getFilesInfo(path) {
  let files = await readdir(path);
  files = files.filter((file) => file.split('.').length >= 2);
  files = files.map(async (file) => {
    const { size, birthtime } = await stat(`${path}/${file}`);
    return { filename: file, size, birthtime };
  });
  return Promise.all(files);
}

module.exports = {
  getRndInteger,
  defineAmountOfSales,
  repeatPromiseUntilResolved,
  transformCsvToJson,
  getFilesInfo,
};
