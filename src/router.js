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
  uploadCSVFile,
  getFiles,
  optimizeFile,
} = require('./controller');

async function streamRouter(request, response) {
  const { url, method } = request;
  if (method === 'PUT') {
    switch (url) {
      case '/upload':
        uploadCSVFile(request, response);
        break;
      default:
        notFound(response);
    }
  }
}

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
      case '/get_files':
        getFiles(response);
        break;
      case '/upload/optimize':
        optimizeFile(response, queryParams);
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

module.exports = { router, streamRouter };
