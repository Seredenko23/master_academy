require('dotenv').config();
const http = require('http');
const { initializeAutomaticOptimization } = require('./optimization');
const handler = require('./handler');

let optimizationTimer;
const server = http.createServer(handler);

function initializeGracefulShutdown() {
  function shutdownHandler(error) {
    if (error) console.log('ERROR: ', error);
    console.log('\nServer is closing...');
    clearInterval(optimizationTimer);
    server.close(() => {
      console.log('Server closed!');
      process.exit();
    });
  }

  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);

  process.on('uncaughtException', shutdownHandler);
  process.on('unhandledRejection', shutdownHandler);
}

function boot() {
  initializeGracefulShutdown();
  optimizationTimer = initializeAutomaticOptimization('./upload', process.env.PORT);
  server.listen(+process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
}

boot();
