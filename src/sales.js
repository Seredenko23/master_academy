const { promisify } = require('util');
const { getRndInteger } = require('./utils');

function generateSale() {
  const sale = getRndInteger(1, 99);
  if (sale >= 20) throw new Error('Sale greater than it needed');
  return sale;
}

function getSale(callback) {
  setTimeout(() => {
    try {
      const sale = generateSale();
      callback(null, sale);
    } catch (e) {
      callback(e.message);
    }
  }, 50);
}

function getSalePromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(generateSale());
      } catch (e) {
        reject(e.message);
      }
    }, 50);
  });
}

const getSalePromisified = promisify(getSale);

module.exports = { getSale, getSalePromisified };
