const { parseQuery } = require('querystring');
const { URL } = require('url');

function handler(request, response) {
  try {
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
      });
  } catch (err) {
    console.log(err.message);
  }
}
