const { task1: filter, task2: highestPrice, task3: modify } = require('./task');
const json = require('../data.json');

function getFilteredData(response, queryParams) {
  const { field, value } = queryParams;
  response.write(JSON.stringify(filter(json, field, value)));
  response.end();
}

function getHighestPrice(response) {
  response.write(JSON.stringify(highestPrice));
  response.end();
}

function getModifyData(response) {
  response.write(JSON.stringify(modify(json)));
  response.end();
}

function notFound(response) {
  response.write('404 Not Found');
  response.statusCode = 404;
  response.end();
}

module.exports = { getFilteredData, getHighestPrice, getModifyData, notFound };
