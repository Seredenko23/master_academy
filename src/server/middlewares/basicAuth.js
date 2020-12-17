const { login, password } = require('../../config');
const { generateError } = require('../../services/error');

function basicAuth(req, res, next) {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [baseLogin, basePassword] = Buffer.from(b64auth, 'base64').toString().split(':');
  if (login === baseLogin && password === basePassword) {
    return next();
  }
  const err = generateError('Authorization required!', 'AuthorizationError');
  throw err;
}

module.exports = basicAuth;
