const http = require('http');
const app = require('./server');
const { port } = require('./config');
const { prepareServer } = require('./services/utils');

const server = http.createServer(app);

async function boot() {
  await prepareServer(server);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

boot();
