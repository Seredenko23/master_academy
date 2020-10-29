const json = require('../../data.json');

function getHighetPriceProduct(products) {
  let result;
  let max = 0;
  products.forEach((product) => {
    const price = product.price || product.priceForPair;
    const quantity = product.quantity || 0;
    const totalPrice = +price.slice(1) * quantity;
    if (totalPrice > max) {
      result = product;
      max = totalPrice;
    }
  });
  return result;
}

module.exports = getHighetPriceProduct(json);
