require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  optimizationTime: process.env.OPTIMIZATION_TIME || 600000,
  login: process.env.LOGIN || '',
  password: process.env.PASSWORD || '',
};

module.exports = config;
