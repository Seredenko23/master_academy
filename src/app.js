require('dotenv').config();
const http = require('http');
const fs = require('fs');
const { initializeAutomaticOptimization } = require('./optimization');
const handler = require('./handler');

let optimizationJob;
const server = http.createServer(handler);

function initializeGracefulShutdown() {
  function shutdownHandler(error) {
    if (error) console.log('ERROR: ', error);
    console.log('\nServer is closing...');
    optimizationJob.cancel();
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
  if (!fs.existsSync(process.env.UPLOAD_DIRECTORY)) fs.mkdirSync(process.env.UPLOAD_DIRECTORY);
  if (!fs.existsSync(process.env.OPTIMIZED_DIRECTORY))
    fs.mkdirSync(process.env.OPTIMIZED_DIRECTORY);
  initializeGracefulShutdown();
  optimizationJob = initializeAutomaticOptimization('./upload', process.env.OPTIMIZATION_TIME);
  server.listen(+process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
}

boot();
