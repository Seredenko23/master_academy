const Knex = require('knex');
const { db: dbConfig } = require('../config');

const knex = new Knex(dbConfig);

async function testConnection() {
  try {
    console.log('Test connection to database...');
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function closeDatabase() {
  console.log('Stoping database...');
}

module.exports = {
  knex,
  testConnection,
  closeDatabase,
};
