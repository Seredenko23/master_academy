const {
  getFilteredData,
  getHighestPrice,
  getModifyData,
  notFound,
  rewriteStore,
  swapSources,
  getSalesPromise,
  getSalesAsync,
  getSalesCallbacks,
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
      case '/sales_callbacks':
        getSalesCallbacks(response);
        break;
      case '/sales_promise':
        getSalesPromise(response);
        break;
      case '/sales_async':
        getSalesAsync(response);
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
