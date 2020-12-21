exports.seed = function (knex) {
  return knex('types')
    .del()
    .then(() => {
      return knex('types').insert([{ type: 'gloves' }, { type: 'hat' }, { type: 'jeans' }]);
    });
};
