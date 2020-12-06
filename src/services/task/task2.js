function getHighestPriceProduct(products) {
  let result;
  let max = 0;
  products.forEach((product) => {
    const price = product.price || product.priceForPair;
    const quantity = product.quantity || 0;
    if (price * quantity > max) {
      result = product;
      max = price;
    }
  });
  return result;
}

module.exports = getHighestPriceProduct;
