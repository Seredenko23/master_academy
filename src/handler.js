const { parse: parseQuery } = require('querystring');
const { URL } = require('url');
const { router, streamRouter } = require('./router');

// eslint-disable-next-line consistent-return
function handler(request, response) {
  try {
    if (request.headers['content-type'] === 'text/csv') return streamRouter(request, response);

    const { url } = request;
    const parsedUrl = new URL(url, process.env.ORIGIN);
    const queryParams = parseQuery(parsedUrl.search.slice(1));

    let body = [];

    request
      .on('error', (err) => {
        console.log(err);
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        router(
          {
            ...request,
            data: body ? JSON.parse(body) : {},
            url: parsedUrl.pathname,
            queryParams,
          },
          response,
        );
      });
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = handler;
