function router(request, response) {
  const { url, method, queryParams, data } = request;

  console.log('data: ', data);
  console.log('queryParams: ', queryParams);
  console.log('url:', url);

  if (method === 'GET') {
    switch (url) {
      case '/':
        console.log('home');
        break;
      case '/filter':
        console.log('filter');
        break;
      case '/highest_price':
        console.log('highest_price');
        break;
      case '/modify':
        console.log('modify');
        break;
      default:
        console.log('notFound');
    }
  }
}

module.exports = router;
