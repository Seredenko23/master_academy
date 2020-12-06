const { repeatPromiseUntilResolved, defineAmountOfSales } = require('../../services/utils');
const { getSale, getSalePromisified } = require('../../services/sales');
const { getSource } = require('./task');

function getSalesCallbacks(response) {
  const data = getSource();
  const newSales = [];
  data.myMap((prod) => getSale(callback, prod));

  function callback(err, value, product) {
    if (err) {
      getSale(callback, product);
      return;
    }

    const limit = defineAmountOfSales(product);
    if (Array.isArray(product.sale)) product.sale.push(value);
    else product.sale = [value];

    if (Array.isArray(product.sale) && product.sale.length === limit) {
      product.sale = product.sale.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
      newSales.push(product);
    } else {
      getSale(callback, product);
    }

    if (newSales.length !== data.length) return;
    response.send(newSales);
  }
}

function getSalesPromise(response) {
  const data = getSource().myMap((product) => {
    const amount = defineAmountOfSales(product);
    const sales = [];
    for (let i = 0; i < amount; i++) sales.push(repeatPromiseUntilResolved(getSalePromisified));
    return Promise.all(sales)
      .then((salesArray) => {
        product.sale = salesArray.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
        return product;
      })
      .catch(() => {
        response.status(500).send({ status: 'error' });
      });
  });
  Promise.all(data)
    .then((result) => {
      response.send(result);
    })
    .catch(() => {
      throw new Error('Cant generate sales');
    });
}

async function getSalesAsync(response) {
  try {
    let data = getSource();
    data = data.myMap(async (product) => {
      const amount = defineAmountOfSales(product);
      let sales = [];
      for (let i = 0; i < amount; i++) sales.push(repeatPromiseUntilResolved(getSalePromisified));
      sales = await Promise.all(sales);
      sales = sales.map((sale) => (100 - sale) / 100).reduce((acc, red) => acc * red);
      product.sale = sales;
      return product;
    });
    data = await Promise.all(data);
    response.send(data);
  } catch (e) {
    throw new Error('Cant generate sales');
  }
}

module.exports = { getSalesCallbacks, getSalesPromise, getSalesAsync };
