require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  optimizationTime: process.env.OPTIMIZATION_TIME || '*/10 * * * *',
  login: process.env.LOGIN || '',
  password: process.env.PASSWORD || '',
  uploadDirectory: process.env.UPLOAD_DIRECTORY || './upload',
  optimizedDirectory: process.env.OPTIMIZED_DIRECTORY || './upload/optimized',
  accessSecret: process.env.ACCESS_TOKEN_SECRET || '',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET || '',
  db: {
    client: 'postgresql',
    connection: {
      name: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      port: process.env.DB_PORT || '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: true,
  },
};

module.exports = config;
