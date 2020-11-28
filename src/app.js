const app = require('./server');
const { port, optimizationTime } = require('./config');

const { initializeAutomaticOptimization } = require('./services/optimization');

let optimizationTimer;
let server;

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

async function boot() {
  initializeGracefulShutdown();
  optimizationTimer = initializeAutomaticOptimization('./upload', optimizationTime);
  server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

boot();
