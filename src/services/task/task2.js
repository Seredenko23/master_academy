function getHighestPriceProduct(products) {
  let result;
  let max = 0;
  products.forEach((product) => {
    const price = product.price || product.priceForPair;
    const quantity = product.quantity || 0;
    const maxPrice = price * quantity;
    if (maxPrice > max) {
      result = product;
      max = maxPrice;
    }
  });
  return result;
}

module.exports = getHighestPriceProduct;
