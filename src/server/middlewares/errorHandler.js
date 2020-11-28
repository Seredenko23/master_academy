const e = require('express');

function errorHandler(err, req, res, next) {
  switch (err.name) {
    case 'AuthorizationError':
      res.status(401).send(err.message);
      break;
    default:
      res.status(500).send(err.message);
      break;
  }
}

module.exports = errorHandler;
