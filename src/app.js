const fs = require('fs');
const app = require('./server');
const { port, optimizationTime, optimizedDirectory, uploadDirectory } = require('./config');

const { initializeAutomaticOptimization } = require('./services/optimization');

let optimizationJob;
let server;

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

async function boot() {
  if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);
  if (!fs.existsSync(optimizedDirectory)) fs.mkdirSync(optimizedDirectory);
  initializeGracefulShutdown();
  optimizationJob = initializeAutomaticOptimization('./upload', optimizationTime);
  server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

boot();
