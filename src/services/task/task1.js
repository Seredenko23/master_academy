function filterProducts(products, param, value) {
  return products.filter((product) => product[param] === value);
}

module.exports = filterProducts;
