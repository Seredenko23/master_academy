require('dotenv').config({ path: `${process.env.PWD}/.env` });

const { db: dbConfig } = require('../config/index');

module.exports = { development: dbConfig };
