function modifyProducts(products) {
  return products.map((product) => {
    const price = product.price || product.priceForPair;
    const quantity = product.quantity || 0;
    return { type: product.type, color: product.color, quantity, price };
  });
}

module.exports = modifyProducts;
