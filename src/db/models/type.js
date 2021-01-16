const { knex } = require('../index');
const { generateError } = require('../../services/error');

async function getType(type) {
  try {
    if (!type) throw generateError('No type defined', 'BadRequestError');
    console.log('Type', type);
    const [res] = await knex('types').where({ type });

    if (!res) throw generateError('No type defined in db');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createType(type) {
  try {
    if (!type) throw generateError('No type defined', 'BadRequestError');

    const [res] = await knex('types').insert({ type }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteType(id) {
  try {
    if (!id) throw generateError('No id defined', 'BadRequestError');

    await knex('types').where({ id }).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType(id, type) {
  try {
    if (!id) throw generateError('No id defined', 'BadRequestError');

    const [res] = await knex('types').update({ type }).where({ id }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = { getType, createType, deleteType, updateType };
