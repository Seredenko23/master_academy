const jwt = require('jsonwebtoken');
const { refreshSecret } = require('../../config');
const { generateError } = require('../../services/error');
const { generateAccessToken, generateRefreshToken } = require('../../services/utils');

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) generateError('Username and passwrod required!', 'BadRequestError');

  const user = { username, password };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.send({ accessToken, refreshToken });
}

function refresh(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) throw generateError('Invalid data!', 'BadRequestError');
  jwt.verify(refreshToken, refreshSecret, (err, user) => {
    if (err) throw generateError('Authrozitaion error!', 'AuthrozitaionError');
    const newAccessToken = generateAccessToken({
      username: user.username,
      password: user.password,
    });
    res.json({ accessToken: newAccessToken });
  });
}

module.exports = { login, refresh };
