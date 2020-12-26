const { Router } = require('express');
const { authorizationController } = require('../controllers');

const authorization = Router();

authorization.post('/login', (req, res) => {
  authorizationController.login(req, res);
});

authorization.post('/refresh', (req, res) => {
  authorizationController.refresh(req, res);
});

module.exports = authorization;
