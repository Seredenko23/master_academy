require('dotenv').config();
const http = require('http');
const handler = require('./handler');

const server = http.createServer(handler);

server.listen(+process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
