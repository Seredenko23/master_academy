const app = require('./server');
const { port } = require('./config');
const { prepareServer } = require('./services/utils');

const { initializeAutomaticOptimization } = require('./services/optimization');

let server;

async function boot() {
  prepareServer(server);
  server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

boot();
