require('dotenv').config();
const http = require('http');
const handler = require('./handler');

const server = http.createServer(handler);

function gracefulShutdown() {
  function shutdownHandler(error) {
    if (error) console.log('ERROR: ', error);
    console.log('\nServer is closing...');
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

gracefulShutdown();

server.listen(+process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
