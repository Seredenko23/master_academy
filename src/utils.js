const { promisify } = require('util');
const { pipeline, Transform } = require('stream');
const { readdir } = require('fs');

const promisifiedPipeline = promisify(pipeline);
const promisifiedReaddir = promisify(readdir);

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
    let jsonStr = red.split(',').map((value, ind) => `"${keys[ind]}": "${value}"`);
    jsonStr = `,{${jsonStr}}`;
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
    console.log(csvArray);

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
    callback(null, ']');
  };

  return new Transform({ transform, flush });
}

module.exports = {
  getRndInteger,
  defineAmountOfSales,
  repeatPromiseUntilResolved,
  transformCsvToJson,
  promisifiedPipeline,
  promisifiedReaddir,
};
