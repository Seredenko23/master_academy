const { login, password } = require('../../config');

function basicAuth(req, res, next) {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [baseLogin, basePassword] = Buffer.from(b64auth, 'base64').toString().split(':');
  if (login === baseLogin && password === basePassword) {
    return next();
  }
  const e = new Error('Authorization required!');
  e.name = 'AuthorizationError';
  throw e;
}

module.exports = basicAuth;
