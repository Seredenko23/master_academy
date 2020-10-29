const data = require('./task3');

function getHighetPriceProduct(products) {
  let result;
  let max = 0;
  products.forEach((product) => {
    const { price, quantity } = product;
    const totalPrice = +price.slice(1) * quantity;
    if (totalPrice > max) {
      result = product;
      max = totalPrice;
    }
  });
  return result;
}

console.log(getHighetPriceProduct(data));
