/* eslint-disable no-restricted-globals */
const { promisify } = require('util');
const { pipeline, Transform } = require('stream');
const fs = require('fs');
const { testConnection } = require('../db');
const { initializeAutomaticOptimization } = require('./optimization');
const { optimizedDirectory, uploadDirectory, optimizationTime } = require('../config');

const promisifiedPipeline = promisify(pipeline);

let optimizationJob;

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

function initializeGracefulShutdown(server) {
  function shutdownHandler(error) {
    if (error) console.log('ERROR: ', error);
    console.log('\nServer is closing...');
    optimizationJob.cancel();
    server.close(() => {
      console.log('Server closed!');
      process.exit();
    });
  }

  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);

  process.on('uncaughtException', shutdownHandler);
  process.on('unhandledRejection', shutdownHandler);
}

function checkDirectories() {
  if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);
  if (!fs.existsSync(optimizedDirectory)) fs.mkdirSync(optimizedDirectory);
}

async function prepareServer(server) {
  try {
    await testConnection();
    checkDirectories(server);
    initializeGracefulShutdown(server);
    optimizationJob = initializeAutomaticOptimization('./upload', optimizationTime);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    throw error;
  }
}

module.exports = {
  getRndInteger,
  defineAmountOfSales,
  repeatPromiseUntilResolved,
  transformCsvToJson,
  promisifiedPipeline,
  prepareServer,
};
