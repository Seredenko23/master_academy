const { knex } = require('../index');
const { generateError } = require('../../services/error');

async function getColor(color) {
  try {
    if (!color) throw generateError('No color defined', 'BadRuestError');

    const [res] = await knex('colors').where({ color });

    if (!res) throw generateError('No color defined in db');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function createColor(color) {
  try {
    if (!color) throw generateError('No color defined', 'BadRuestError');

    const [res] = await knex('colors').insert({ color }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteColor(id) {
  try {
    if (!id) throw generateError('No id defined', 'BadRequestError');

    await knex('colors').where({ id }).del();

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateColor(id, color) {
  try {
    if (!id) throw generateError('No id defined', 'BadRequestError');

    const [res] = await knex('colors').update({ color }).where({ id }).returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = { getColor, createColor, deleteColor, updateColor };
