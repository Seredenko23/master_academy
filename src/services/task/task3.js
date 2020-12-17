function modifyProducts(products) {
  return products.map((product) => {
    let price = product.price || product.priceForPair;
    if (price[0] === '$') price = +price.slice(1);
    const quantity = product.quantity || 0;
    return { type: product.type, color: product.color, quantity, price };
  });
}

module.exports = modifyProducts;
