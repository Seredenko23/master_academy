const {
  getFilteredData,
  getHighestPrice,
  getModifyData,
  notFound,
  rewriteStore,
  swapSources,
} = require('./controller');

function router(request, response) {
  const { url, method, queryParams, data } = request;

  if (method === 'GET') {
    switch (url) {
      case '/':
        console.log('Home');
        break;
      case '/filter':
        getFilteredData(response, queryParams);
        break;
      case '/highest_price':
        getHighestPrice(response);
        break;
      case '/modify':
        getModifyData(response);
        break;
      case '/swap':
        swapSources(response);
        break;
      default:
        notFound(response);
    }
  } else if (method === 'POST') {
    switch (url) {
      case '/rewrite':
        rewriteStore(response, data);
        break;
      default:
        notFound(response);
        break;
    }
  }
}

module.exports = router;
