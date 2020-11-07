const { getFilteredData, getHighestPrice, getModifyData, notFound } = require('./controller');

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
      default:
        notFound(response);
    }
  }
}

module.exports = router;
